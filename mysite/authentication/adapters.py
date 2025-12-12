from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings

# Reference: https://stackoverflow.com/a/75902435
# To override the custom account adapter of allauth for changing the url link the email, and also the contents of the email
class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):

        """
            Changing the confirmation URL to fit the domain that we are working on
        """

        url = (
            f"{settings.FRONTEND_URL}/email/verification/{emailconfirmation.key}"
        )
        return url
        
