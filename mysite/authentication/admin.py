from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()

class UserAdmin(BaseUserAdmin):
    #add image fields to the admin in the user site
    fieldsets = BaseUserAdmin.fieldsets + (
            ('Profile', {'fields': ('picture_url', 'picture_file')}),
    )
    
    filter_horizontal = ["groups", "user_permissions",]

admin.site.register(User, UserAdmin)