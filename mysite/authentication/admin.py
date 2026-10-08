from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import CustomAdminAuthenticationForm

admin.site.login_form = CustomAdminAuthenticationForm

User = get_user_model()

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('picture_url', 'picture_file')}),
    )

    filter_horizontal = ["groups", "user_permissions"]


admin.site.register(User, UserAdmin)