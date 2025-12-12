from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView, ResendEmailVerificationView, VerifyEmailView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView, PasswordResetView, PasswordResetConfirmView, PasswordChangeView
from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView, TokenObtainPairView
from authentication.views import GoogleLogin

urlpatterns = [
    path("register/", RegisterView.as_view(), name="rest_register"),
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("user/", UserDetailsView.as_view(), name="rest_user_details"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path("google/", GoogleLogin.as_view(), name="google_login"),
    path("password/reset/", PasswordResetView.as_view(), name="password_reset"),
    path("password/reset/confirm/<uid>/<token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("password/change/", PasswordChangeView.as_view(), name="password_change"),
    path("email/verification/", VerifyEmailView.as_view(), name="account_email_verification_sent"),
    path("email/verification/resend/", ResendEmailVerificationView.as_view(), name="resend_account_email_verification_sent"),
]