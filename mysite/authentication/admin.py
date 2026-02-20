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

admin.site.unregister(TokenProxy)