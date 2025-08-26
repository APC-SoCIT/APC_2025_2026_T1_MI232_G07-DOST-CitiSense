# authentication/signals.py
from allauth.socialaccount.signals import pre_social_login
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(pre_social_login)
def save_google_picture(sender, request, sociallogin, **kwargs):
    user = sociallogin.user  # get the customUser model which contains the current user model + picture model
    extra_data = sociallogin.account.extra_data # get the extra_data associated with google
    picture_url = extra_data.get("picture") # get the picture from the current google logged in user
    
    # get the current picture url from google
    if picture_url:
        user.picture_url = picture_url
        
    # set username if missing
    if not user.username:
        user.username = extra_data.get("name") or extra_data.get("given_name")

    user.save()