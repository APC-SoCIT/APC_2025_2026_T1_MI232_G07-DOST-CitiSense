from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


User = get_user_model()

class UserAdmin(BaseUserAdmin):
    filter_horizontal = ["groups", "user_permissions",]

admin.site.register(User, UserAdmin)