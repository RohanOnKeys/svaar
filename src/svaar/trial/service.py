"""Demo teams for people who sign in on the website.

Normally organizations are created only by an operator. This is the one other path,
and it is deliberately narrow: it runs only when the trial feature is enabled, only
for a Google-verified identity, and each Google account gets exactly one demo team in
which it is the lead. Signing in again returns the same team.
"""

import uuid
from dataclasses import dataclass
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from svaar.identity.models import ChannelBinding, Org, Principal, Role
from svaar.identity.service import resolve_principal, verified_channels
from svaar.trial.firebase import GoogleIdentity

# Channel name for the Google account binding; the address is the Firebase user ID.
GOOGLE_CHANNEL = "google"


@dataclass(frozen=True)
class TrialMember:
    """The signed-in person and their demo team."""

    org_id: uuid.UUID
    principal_id: uuid.UUID
    display_name: str
    email: str | None
    phone_verified: bool
    created: bool


def find_member(session: Session, identity: GoogleIdentity) -> Principal | None:
    """Return the person already enrolled with this Google account, if any."""
    return resolve_principal(session, GOOGLE_CHANNEL, identity.uid)


def start_trial(session: Session, identity: GoogleIdentity, display_name: str) -> TrialMember:
    """Return this Google account's demo team, creating it on first sign-in.

    The caller commits. Concurrent first sign-ins for the same account are settled by
    the unique (channel, address) constraint: one commits, the other fails and may
    simply retry, which then finds the existing member.
    """
    principal = find_member(session, identity)
    created = principal is None
    if principal is None:
        name = display_name.strip()[:200] or identity.name or identity.email.split("@")[0]
        org = Org(name=f"Demo team · {name}"[:200])
        session.add(org)
        session.flush()
        principal = Principal(
            org_id=org.id, role=Role.LEAD.value, display_name=name, email=identity.email
        )
        session.add(principal)
        session.flush()
        session.add(
            ChannelBinding(
                principal_id=principal.id,
                channel=GOOGLE_CHANNEL,
                address=identity.uid,
                verified_at=datetime.now(UTC),
            )
        )
        session.flush()
    return TrialMember(
        org_id=principal.org_id,
        principal_id=principal.id,
        display_name=principal.display_name,
        email=principal.email,
        phone_verified="phone" in verified_channels(session, principal.id),
        created=created,
    )
