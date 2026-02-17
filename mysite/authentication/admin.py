from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, GroupAdmin
from allauth.account.models import EmailAddress
from allauth.account.admin import EmailAddressAdmin
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import TokenProxy, Token
from rest_framework.authtoken.admin import TokenAdmin
from django.contrib.admin.sites import NotRegistered

User = get_user_model()

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('picture_url', 'picture_file')}),
    )

    filter_horizontal = ["groups", "user_permissions"]


admin.site.register(User, UserAdmin)

# Customize the EmailAddress admin from django all-auth and put it in the authentication admin section
EmailAddress._meta.verbose_name = "Registered Email"
EmailAddress._meta.verbose_name_plural = "Registered Emails"
EmailAddress._meta.app_label = "authentication"

admin.site.unregister(EmailAddress)
admin.site.register(EmailAddress, EmailAddressAdmin)

# Put the group section in the authentication section
Group._meta.app_label = "authentication"
admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)

# Put the token section in the authentication section
Token._meta.app_label = "authentication"

admin.site.unregister(TokenProxy)
# Register Token with its admin class
admin.site.register(Token, TokenAdmin)