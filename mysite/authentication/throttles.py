from rest_framework.throttling import AnonRateThrottle

class AuthThrottle(AnonRateThrottle):
    scope = "auth"

class PasswordResetThrottle(AnonRateThrottle):
    scope = "password_reset"

class EmailVerificationThrottle(AnonRateThrottle):
    scope = "verify_email"