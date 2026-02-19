from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.views import RegisterView, ResendEmailVerificationView, VerifyEmailView
from dj_rest_auth.views import LoginView, PasswordResetView, PasswordResetConfirmView
from .throttles import AuthThrottle, PasswordResetThrottle, EmailVerificationThrottle

User = get_user_model()

#fix for "OAuth2Client.__init__() got multiple values for argument 'scope_delimiter'" error
#link to solution: https://github.com/iMerica/dj-rest-auth/issues/673#issuecomment-2726403865
class CustomGoogleOAuth2Client(OAuth2Client):
    def __init__(
        self,
        request,
        consumer_key,
        consumer_secret,
        access_token_method,
        access_token_url,
        callback_url,
        _scope,  # This is fix for incompatibility between django-allauth==65.3.1 and dj-rest-auth==7.0.1
        scope_delimiter=" ",
        headers=None,
        basic_auth=False,
    ):
        super().__init__(
            request,
            consumer_key,
            consumer_secret,
            access_token_method,
            access_token_url,
            callback_url,
            scope_delimiter,
            headers,
            basic_auth,
        )

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173/accounts/google/login/callback/"
    client_class = CustomGoogleOAuth2Client

class UserPostListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Throttle for unauthenticated routes
# Register, and login API has a throttle of 5 per minute
# Password reset views (send email, and password form) have a throttle of 10 per minute
# Email verification views (send email after registration, and resend email) have a throttle of 10 per minute
class ThrottledRegisterView(RegisterView):
    throttle_classes = [AuthThrottle]

class ThrottledLoginView(LoginView):
    throttle_classes = [AuthThrottle]

class ThrottledGoogleLoginView(GoogleLogin):
    throttle_classes = [AuthThrottle]

class ThrottledSendPasswordReset(PasswordResetView):
    throttle_classes = [PasswordResetThrottle]

class ThrottledPasswordResetForm(PasswordResetConfirmView):
    throttle_classes = [PasswordResetThrottle]

class ThrottledVerifyEmailView(VerifyEmailView):
    throttle_classes = [EmailVerificationThrottle]

class ThrottledResendEmailVerificationView(ResendEmailVerificationView):
    throttle_classes = [EmailVerificationThrottle]