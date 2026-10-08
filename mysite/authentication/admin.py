from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from rest_framework.authtoken.models import TokenProxy, Token
from .forms import CustomAdminAuthenticationForm
from django.contrib.admin.sites import NotRegistered
import rest_framework.authtoken.admin

admin.site.login_form = CustomAdminAuthenticationForm

User = get_user_model()

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('picture_url', 'picture_file')}),
    )

    filter_horizontal = ["groups", "user_permissions"]


admin.site.register(User, UserAdmin)


for model in (TokenProxy, Token):
    try:
        admin.site.unregister(model)
    except NotRegistered:
        pass