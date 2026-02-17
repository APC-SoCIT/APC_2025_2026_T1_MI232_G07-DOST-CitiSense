from django.contrib import admin
from .models import FileMigration
import os
from .forms import FileMigrationForm

class FileMigrationAdmin(admin.ModelAdmin):
    form = FileMigrationForm
    list_display = ["sql_file_name", "uploaded_at", "processed_at", "uploaded_by", "skipped_rows", "migrated_rows", "migration_duration"]
    readonly_fields = [ "uploaded_at", "processed_at", "uploaded_by", "skipped_rows", "migrated_rows", "migration_duration"]
    
    # To automatically populate the uploaded_by with the user who uploaded the file
    # Reference: https://docs.djangoproject.com/en/6.0/ref/contrib/admin/#django.contrib.admin.ModelAdmin.save_model
    def save_model(self, request, obj, form, change):
        if not change:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
    
    # This is to not allow any user to edit/change the migration file saved in the database to prevent any inconsistencies, etc.
    # Reference: https://docs.djangoproject.com/en/6.0/ref/contrib/admin/#django.contrib.admin.ModelAdmin.has_change_permission
    def has_change_permission(self, request, obj=None):
        if obj: 
            return False
        return True
    
    # Get the SQL file name that the user uploaded; this is calculated from the file name saved in the database
    # Reference: https://stackoverflow.com/a/23747842
    def sql_file_name(self, obj):
        return os.path.basename(obj.sql_file.name)
    
    # Make the column name "SQL File", and make it sortable
    sql_file_name.short_description = "SQL File"
    sql_file_name.admin_order_field  = 'sql_file'
    
admin.site.register(FileMigration, FileMigrationAdmin)

# To change the admin panel to CitiSense specific branding
# Reference: https://stackoverflow.com/a/36251770
admin.site.site_header = "CitiSense Administration"
admin.site.site_title = "CitiSense Administration"
admin.site.index_title = "Feature selection"