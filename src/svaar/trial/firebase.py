"""Verify Firebase "Sign in with Google" ID tokens without trusting the browser.

The browser only forwards the token. Everything is checked here: Google's signature
(keys fetched from Google and cached), audience and issuer for our Firebase project,
expiry, a non-empty subject, a Google-verified email and the Google sign-in provider.
Any failure yields one generic error; the reason is logged, never returned.
"""

import logging
from collections.abc import Callable
from dataclasses import dataclass

import jwt

logger = logging.getLogger(__name__)

JWKS_URL = (
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
)
LEEWAY_SECONDS = 30
MAX_TOKEN_LENGTH = 4096

KeyResolver = Callable[[str], object]


class InvalidSignInError(Exception):
    """The sign-in token was missing, malformed, expired or not for this project."""


@dataclass(frozen=True)
class GoogleIdentity:
    """A person whose Google account Firebase has verified."""

    uid: str
    email: str
    name: str | None


class FirebaseVerifier:
    """Checks ID tokens for one Firebase project."""

    def __init__(self, project_id: str, *, key_for_token: KeyResolver | None = None) -> None:
        self._project_id = project_id
        if key_for_token is None:
            client = jwt.PyJWKClient(JWKS_URL, cache_keys=True, lifespan=3600, timeout=5)
            key_for_token = lambda token: client.get_signing_key_from_jwt(token).key  # noqa: E731
        self._key_for_token = key_for_token

    def verify(self, token: str) -> GoogleIdentity:
        """Return the verified identity behind a token.

        Raises:
            InvalidSignInError: For any token that does not pass every check.
        """
        if not token or len(token) > MAX_TOKEN_LENGTH:
            raise InvalidSignInError("Sign-in token missing or too long")
        try:
            key = self._key_for_token(token)
            claims = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                audience=self._project_id,
                issuer=f"https://securetoken.google.com/{self._project_id}",
                leeway=LEEWAY_SECONDS,
                options={"require": ["exp", "iat", "aud", "iss", "sub"]},
            )
        except Exception as error:  # Any library or key-fetch failure is a rejection.
            logger.info("trial_sign_in_rejected", extra={"reason": type(error).__name__})
            raise InvalidSignInError("Sign-in token rejected") from None

        subject = claims.get("sub")
        email = claims.get("email")
        provider = (claims.get("firebase") or {}).get("sign_in_provider")
        if not isinstance(subject, str) or not 0 < len(subject) <= 128:
            raise InvalidSignInError("Sign-in token has no subject")
        if not isinstance(email, str) or claims.get("email_verified") is not True:
            raise InvalidSignInError("Google has not verified this email")
        if provider != "google.com":
            raise InvalidSignInError("Only Google sign-in is accepted")
        name = claims.get("name")
        return GoogleIdentity(
            uid=subject,
            email=email.strip().lower(),
            name=name.strip()[:200] if isinstance(name, str) and name.strip() else None,
        )
