from django import forms
from django.core.exceptions import ValidationError
from .models import FileMigration

# Custom form for the .sql file migration
class FileMigrationForm(forms.ModelForm):
    class Meta:
        model = FileMigration
        fields = "__all__"
        
    # Validate that the uploaded file has a .sql extension
    def clean_sql_file(self):
        file = self.cleaned_data.get("sql_file")
        if file and not file.name.endswith(".sql"):
            raise ValidationError("The file must be a .sql file")
        return file
