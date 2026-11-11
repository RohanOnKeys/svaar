"""Website routes for the self-serve demo, authenticated by a Google sign-in token.

Every request carries the Firebase ID token as a Bearer credential and is verified
on the server. The routes are unavailable (503) unless the trial feature is enabled
and a Firebase project is configured.
"""

import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security.utils import get_authorization_scheme_param
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from svaar.api.errors import ErrorResponse
from svaar.db import get_session
from svaar.incidents import service as incidents
from svaar.incidents.service import IncidentNotFoundError
from svaar.trial import service
from svaar.trial.firebase import FirebaseVerifier, GoogleIdentity, InvalidSignInError

SessionDep = Annotated[Session, Depends(get_session)]


def get_verifier(request: Request) -> FirebaseVerifier:
    """Return the app's verifier, or 503 when the trial is switched off."""
    settings = request.app.state.settings
    if not settings.trial_enabled or not settings.firebase_project_id:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE)
    verifier = getattr(request.app.state, "firebase_verifier", None)
    if verifier is None:
        verifier = FirebaseVerifier(settings.firebase_project_id)
        request.app.state.firebase_verifier = verifier
    return verifier


def signed_in(
    request: Request, verifier: Annotated[FirebaseVerifier, Depends(get_verifier)]
) -> GoogleIdentity:
    """Verify the Bearer sign-in token; 401 on any failure."""
    scheme, token = get_authorization_scheme_param(request.headers.get("Authorization"))
    if scheme.lower() != "bearer":
        raise HTTPException(401, headers={"WWW-Authenticate": "Bearer"})
    try:
        return verifier.verify(token)
    except InvalidSignInError:
        raise HTTPException(401, headers={"WWW-Authenticate": "Bearer"}) from None


SignedIn = Annotated[GoogleIdentity, Depends(signed_in)]

router = APIRouter(
    prefix="/try",
    tags=["trial"],
    responses={401: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)


class SessionStart(BaseModel):
    """First step after Google sign-in: the name to use in the demo team."""

    display_name: str = Field(default="", max_length=200)


class Member(BaseModel):
    """The signed-in person and their demo team."""

    org_id: str
    principal_id: str
    display_name: str
    email: str | None
    phone_verified: bool
    created: bool


@router.post("/session", response_model=Member)
def start_session(body: SessionStart, identity: SignedIn, session: SessionDep) -> Member:
    """Create this Google account's demo team on first sign-in; return it after."""
    try:
        member = service.start_trial(session, identity, body.display_name)
        session.commit()
    except IntegrityError:
        # A concurrent first sign-in for the same account won; use its team.
        session.rollback()
        member = service.start_trial(session, identity, body.display_name)
        session.commit()
    return Member(
        org_id=str(member.org_id),
        principal_id=str(member.principal_id),
        display_name=member.display_name,
        email=member.email,
        phone_verified=member.phone_verified,
        created=member.created,
    )


def member_of(identity: GoogleIdentity, session: Session):
    """The enrolled person behind this sign-in; 404 until they have created a team."""
    principal = service.find_member(session, identity)
    if principal is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return principal


class TrialIncident(BaseModel):
    """What the Try page shows about an incident."""

    id: uuid.UUID
    state: str
    workflow_name: str | None
    head_branch: str | None
    failure_count: int
    opened_at: datetime
    last_failure_at: datetime
    acknowledged_at: datetime | None


class TrialEvent(BaseModel):
    """One recorded fact, in occurrence order."""

    occurred_at: datetime
    source: str
    kind: str
    status: str | None
    conclusion: str | None


class LatestIncident(BaseModel):
    """The team's most recent incident, if any, with its timeline."""

    incident: TrialIncident | None
    events: list[TrialEvent]


@router.get("/incident", response_model=LatestIncident)
def latest_incident(identity: SignedIn, session: SessionDep) -> LatestIncident:
    """Return the signed-in person's team's most recent incident and its timeline."""
    principal = member_of(identity, session)
    found = incidents.list_incidents(session, principal.org_id, active_only=False, limit=1)
    if not found:
        return LatestIncident(incident=None, events=[])
    incident = found[0]
    entries = incidents.timeline(session, principal.org_id, incident.id)
    return LatestIncident(
        incident=TrialIncident.model_validate(incident, from_attributes=True),
        events=[TrialEvent.model_validate(entry, from_attributes=True) for entry in entries],
    )


@router.post("/incident/{incident_id}/acknowledge", response_model=TrialIncident)
def acknowledge_incident(
    incident_id: uuid.UUID, identity: SignedIn, session: SessionDep
) -> TrialIncident:
    """Acknowledge an incident on the person's own team, which stops escalation."""
    principal = member_of(identity, session)
    try:
        incident, _changed = incidents.acknowledge(
            session, principal.org_id, incident_id, principal.id
        )
    except IncidentNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND) from None
    session.commit()
    return TrialIncident.model_validate(incident, from_attributes=True)
