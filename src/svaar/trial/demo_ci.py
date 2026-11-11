"""Start the controlled failing workflow in the dedicated demo repository.

Only the configured demo repository is ever touched, through the GitHub App's
installation token limited to that one repository with Actions write. The workflow
is the runbook's controlled fixture: started by hand, fails when fail=true, never
deploys anything.
"""

import re

import httpx

from svaar.integrations.github_app import GithubAppClient, GithubUnavailableError

WORKFLOW_FILE = re.compile(r"[A-Za-z0-9_.-]{1,100}\.ya?ml")


class DemoWorkflowClient(GithubAppClient):
    """One demo repository; can only dispatch its controlled workflow."""

    def token_permissions(self) -> dict[str, str]:
        """Starting a workflow run needs Actions write and nothing else."""
        return {"actions": "write", "metadata": "read"}

    def start_failing_run(self, workflow_file: str, ref: str = "main") -> None:
        """Dispatch one run of the controlled workflow with fail=true.

        Raises:
            GithubUnavailableError: If GitHub does not accept the dispatch.
        """
        if not WORKFLOW_FILE.fullmatch(workflow_file) or not re.fullmatch(r"[\w./-]{1,100}", ref):
            raise ValueError("Invalid workflow or ref")
        name = self.repository_name()
        token = self._access_token()
        try:
            response = self._http.post(
                f"repos/{name}/actions/workflows/{workflow_file}/dispatches",
                headers={"Authorization": "Bearer " + token},
                json={"ref": ref, "inputs": {"fail": "true"}},
            )
        except httpx.HTTPError:
            raise GithubUnavailableError("GitHub did not accept the demo run") from None
        if response.status_code not in (200, 204):
            raise GithubUnavailableError("GitHub did not accept the demo run")
