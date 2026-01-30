from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core import management
from drf.utils import analyze_sentiment
import os
from django.db import connection
from django.conf import settings
import subprocess
from django.conf import settings
from django.core.exceptions import ValidationError
import sqlparse

User = get_user_model()

class cleaned_feedback(models.Model):

    SEX_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]

    SERVICETYPE_CHOICES = [
        ("Hybrid Seminar", "Hybrid Seminar"),
        ("Material Requests", "Material Requests"),
        ("Online Library", "Online Library"),
        ("Library Tour", "Library Tour"),
    ]

    QUARTER_CHOICES = [
        ("First Quarter", "First Quarter"),
        ("Second Quarter", "Second Quarter"),
        ("Third Quarter", "Third Quarter"),
        ("Fourth Quarter", "Fourth Quarter"),
    ]

    TYPEOFLIBRARY_CHOICES = [
        ("Non-library Institution", "Non-library Institution"),
        ("Academic Library", "Academic Library"),
        ("School Library", "School Library"),
        ("Public Library", "Public Library"),
    ]

    CATEGORY_CHOICES = [
        ("Librarian/Library Staff", "Librarian/Library Staff"),
        ("Students", "Students"),
        ("Administrative Officer / Administrative Staff", "Administrative Officer / Administrative Staff"),
        ("Teachers / Teaching Personnel / Professors", "Teachers / Teaching Personnel / Professors"),
    ]

    REGION_CHOICES = [
        ("NCR", "NCR"),
        ("CAR", "CAR"),
        ("Region I", "Region I"),
        ("Region II", "Region II"),
        ("Region III", "Region III"),
        ("Region IV-A", "Region IV-A"),
        ("MIMAROPA", "MIMAROPA"),
        ("Region V", "Region V"),
        ("Region VI", "Region VI"),
        ("Region VII", "Region VII"),
        ("Region VIII", "Region VIII"),
        ("Region IX", "Region IX"),
        ("Region X", "Region X"),
        ("Region XI", "Region XI"),
        ("Region XII", "Region XII"),
        ("Region XIII", "Region XIII"),
        ("BARMM", "BARMM"),
    ]

    service_name = models.CharField(max_length=255, null=True, blank=True)
    service_type = models.CharField(max_length=255, null=True, blank=True, choices=SERVICETYPE_CHOICES)
    timestamp = models.DateTimeField(null=True, blank=True)
    quarter = models.CharField(max_length=255, null=True, blank=True, choices=QUARTER_CHOICES)
    year = models.CharField(max_length=5, null=True, blank=True)
    sex = models.CharField(max_length=255, null=True, blank=True, choices=SEX_CHOICES)
    category = models.CharField(max_length=255, null=True, blank=True, choices=CATEGORY_CHOICES)
    typeoflibrary = models.CharField(max_length=255, null=True, blank=True, choices=TYPEOFLIBRARY_CHOICES)
    region = models.CharField(max_length=255, null=True, blank=True, choices=REGION_CHOICES)
    key_takeaways = models.TextField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    suggestions = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    # Automatically create a labeled feedback entry when a new instance of cleaned_feedback is saved.
    # Reference: https://stackoverflow.com/a/52196467
    def save(self, *args, **kwargs):
        created = self.pk is None
        super().save(*args, **kwargs)
        
        if created:
            labeled_feedback.objects.create(feedback=self)
    

class labeled_feedback(models.Model):
    
    SENTIMENT_CHOICES = [
        ("Positive", "Positive"),
        ("Neutral", "Neutral"),
        ("Negative", "Negative"),
    ]

    feedback = models.ForeignKey(cleaned_feedback, on_delete=models.CASCADE, unique=True)
    sentiment = models.CharField(max_length=255, null=True, blank= True, choices=SENTIMENT_CHOICES)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(editable=False, null=True, blank=True)
    last_modified_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    
    def save(self, *args, **kwargs):
        # Only populate the update_at field when it's edited by a user
        #https://stackoverflow.com/a/1737078
        '''On save, update timestamps'''
        if not self.id:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()

        # Apply a sentiment to a row that doesn't have one.
        # Also checks if there is a comment in the cleaned_feedback row it's referencing, before applying a sentiment.
        if not self.sentiment and self.feedback.comments:
            try:
                self.sentiment = analyze_sentiment(self.feedback.comments)
            except Exception as e:
                print(f"Sentiment analysis failed for ID: {self.pk}: {e}")
                self.sentiment = None
      
        return super().save(*args, **kwargs)
    
class FileMigration(models.Model):
    sql_file = models.FileField(upload_to="sql_dumps/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(User, null=False, blank=False, on_delete=models.PROTECT)

    def save(self, *args, **kwargs):
        # Check if the file uploaded is a .sql file
        if not self.sql_file.name.endswith(".sql"):
            raise ValidationError("The file must be a .sql file")
        
        # This will equate to true on new .sql file saves
        is_new = not self.pk
        super().save(*args, **kwargs)

        # This is so that this data migration runs on new .sql file saves
        if is_new:
            try:
                self.execute_migration()
            except Exception as e:
                print(f"Migration failed {e}")

    def execute_migration(self):
        # Open the file, read the content, and parse it to make single SQL statements to be executed
        with open(self.sql_file.path, "r", encoding="utf-8") as file:
            content = file.read()
        statements = sqlparse.split(content)
        
        # Counters for the success/error logging
        execute_count = 0
        migrate_count = 0
        failed_count = 0

        # This allows us to execute SQL commands directly which is coming from the SQL file
        with connection.cursor() as cursor:
            for statement in statements:
                statement = statement.strip()
                
                # Skip empty statements
                if not statement:
                    continue
                try:
                    cursor.execute(statement)
                    execute_count += 1
                    if cursor.rowcount > 0:  # Only count if rows were affected
                        migrate_count += cursor.rowcount
                    
                except Exception as e:
                    print(f"Data population failed for ID: {self.pk}: {e}")
                    failed_count += 1
            
            # Logging success/error messages
            print(f"Executed {execute_count} statements")
            print(f"Migrated {migrate_count} rows")
            if failed_count > 0:
                print(f"Failed: {failed_count} statements")

            # This creates a sentiment according to the feedback of the cleaned_feedback object
            self.populate_labeled()

    # Automatically create a labeled feedback entry when a new instance of cleaned_feedback is saved (Data migration version)   
    def populate_labeled(self):
        labeled_count = 0
        try:
            for row in cleaned_feedback.objects.filter(labeled_feedback__isnull=True):
                labeled_feedback.objects.create(feedback=row)
                labeled_count += 1
            print(f"Successfully added sentiment to {labeled_count} rows")
        except Exception as e:
            print(f"Failed to populate sentiment {e}")

    # Reference for the os.path.basename    
    def __str__(self):
        return f"File Migration #{self.id}"