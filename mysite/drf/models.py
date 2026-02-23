from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from drf.utils import analyze_sentiment
import os
from django.conf import settings
from django.core.exceptions import ValidationError, PermissionDenied
from django.db import connection
import sqlparse
import time
import re
import csv
from django.db.models.functions import Upper
from .utils import normalize

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
    migrated_rows = models.IntegerField(default=0)
    skipped_rows = models.IntegerField(default=0)
    migration_duration = models.FloatField(default=0.0, help_text="Migration time in seconds")

    # Change what the label for the django admin interface for the filemigration model
    class Meta:
        verbose_name = "Upload migration file"
        verbose_name_plural = "Upload migration files"
        default_permissions = ('add',)

    def save(self, *args, **kwargs):
        # Check if the file uploaded is a .sql file
        if not self.sql_file.name.endswith(".sql"):
            raise ValidationError("The file must be a .sql file")
        
        if not self.uploaded_by.groups.filter(name="File migration").exists():
            raise PermissionDenied

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
        start_time = time.time()
        # Open the file, read the content, and parse it to make single SQL statements to be executed
        with open(self.sql_file.path, "r", encoding="utf-8") as file:
            content = file.read()
        statements = sqlparse.split(content)
        
        # Counters for the success/error logging
        execute_count = 0
        migrate_count = 0
        failed_count = 0
        skip_count = 0

        # Get the all the values to be matched with the SQL statements
        # Conert the '' to None for checking.
        # You need to put it in a tuple to be able to use the normalized values in a set.
        existing_records = set(tuple(normalize(v) for v in row) 
                               for row in cleaned_feedback.objects.values_list(
                                "service_name", "service_type", "sex", "category",
                                "key_takeaways", "comments", "suggestions"
                                ))

        # This allows us to execute SQL commands directly which is coming from the SQL file
        # Reference: https://docs.djangoproject.com/en/6.0/topics/db/sql/#executing-custom-sql-directly
        with connection.cursor() as cursor:
            for statement in statements:
                statement = statement.strip()
                
                # Skip empty statements
                if not statement:
                    continue    
                lowered = statement.lower()

                # Skip commands/statements that contain destructive commands.
                if lowered.startswith(("drop table", "create table", "delete from", "truncate", "update")):
                    continue 

                # If the statement starts with INSERT INTO `drf_cleaned_feedback`, 
                # Then replace it with INSERT INTO `drf_cleaned_feedback` (column_names**)
                if re.search(r"insert into `?drf_cleaned_feedback`?", lowered):
                    
                    # Get the SQL insert statement for the drf_cleaned_feedback and split them by each value
                    # Sample regex: https://regex101.com/r/IsjIee/1
                    statement_values_array = re.findall(r"\((?:[^(]+|'[^']*')+\)", statement)

                    if re.search(r"INSERT\s+INTO\s+`?drf_cleaned_feedback`?\s+VALUES", lowered):
                        # Change the insert statement to have all the values, just to be explicit
                        statement = re.sub(r"INSERT\s+INTO\s+`?drf_cleaned_feedback`?\s+VALUES", 
                                                    "INSERT INTO `drf_cleaned_feedback` (id, service_name, service_type, timestamp, " \
                                                    "quarter, year, sex, category, typeoflibrary, region, key_takeaways, comments, suggestions, " \
                                                    "created_at, updated_at) VALUES", 
                                                    statement, 
                                                    flags=re.IGNORECASE)


                    # This will hold the SQL values (filtered out and unique) for the insert statement
                    statements_to_keep = []
                    
                    # Loop over the insert statement value array, and compare it with each of the existing_keys
                    # The value will not be appended if it matches with all the fields
                    for value in statement_values_array:

                        # Parse one SQL value tuple from the INSERT statement into a Python list
                        parsed_values = self.parse_sql_value(value)
                        
                        # Get the current fields in the parsed_values 
                        if parsed_values and len(parsed_values) >= 13:
                            # Convert SQL 'NULL' strings to a None for proper comparison
                            # This is because gives NULL which will be converted to a 'NULL' by the parse_sql_value.
                            service_name = normalize(parsed_values[1])
                            service_type = normalize(parsed_values[2])
                            sex = normalize(parsed_values[6])
                            category = normalize(parsed_values[7])
                            key_takeaways = normalize(parsed_values[10])
                            comments = normalize(parsed_values[11])
                            suggestions = normalize(parsed_values[12])
                            
                            # Create a tuple of the key fields that we will use for duplicate checking
                            record_tuple = (
                                        service_name, service_type, sex, category,
                                        key_takeaways, comments, suggestions
                                    )   
                             
                            # Check if this record already exists in the DB (existing records is a set of tuples)
                            # If it does not exist then append it to the new SQL statement list to be executed and insert into the DB.
                            if record_tuple not in existing_records:
                                statements_to_keep.append(value)

                    # Calculate skipped rows from the original SQL statement array with the statements to keep array
                    skip_count = len(statement_values_array) - len(statements_to_keep)

                    # Skip the statement, if there are now rows to be appended
                    if not statements_to_keep:
                        continue
                    
                    # Rebuild the statement, by first just getting the INSERT INTO `table`, and then appending the VALUES at the end
                    # Final shape will be INSERT INTO `drf_cleaned_feedback` VALUES 
                    insert_part = re.split(r'VALUES\s*\(', statement)[0] + 'VALUES '

                    # Then finally join the SQL value statements with the "INSERT INTO `table` VALUES " sql statement
                    statement = insert_part + ", ".join(statements_to_keep)

                    # Reference for the regex: https://stackoverflow.com/a/11475905 and https://stackoverflow.com/questions/21974376/regex-match-any-whitespace
                    # After changing the value for the insert command, then remove the primary key value with just a "(NULL"
                    # E.g., (1, service_name, service_type, ...) will become (NULL, service_name, service_type, ...)
                    # This is necessary because MySQL will auto-generate the primary key.
                    # If we keep the old primary key value, it could conflict with existing rows, and ultimately not update the database with new rows
                    statement = re.sub(r'\(\s*[0-9]+\s*,', '(NULL,', statement)

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
            print(f"Skipped {skip_count} duplicate rows")
            if failed_count > 0:
                print(f"Failed: {failed_count} statements")

            # This creates a sentiment according to the feedback of the cleaned_feedback object
            labeled_count = self.populate_labeled()

        end_time = time.time()
        elapsed_time = end_time - start_time
        
        # Update the fields only for the migration row, duration and skipped rows.    
        self.migrated_rows = migrate_count
        self.skipped_rows = skip_count
        self.migration_duration = elapsed_time
        self.save(update_fields=["migrated_rows", "skipped_rows", "migration_duration"])

        if labeled_count > 0:
            print(f"Migration completed and sentiment analyzed in {elapsed_time:.2f} seconds")
        else:
            print(f"Migration completed in {elapsed_time:.2f} seconds")

    # Automatically create a labeled feedback entry when a new instance of cleaned_feedback is saved (Data migration version)   
    def populate_labeled(self):
        labeled_count = 0
        print(f"Starting sentiment analysis...")
        try:
            for row in cleaned_feedback.objects.filter(labeled_feedback__isnull=True):
                labeled_feedback.objects.create(feedback=row)
                labeled_count += 1

            if labeled_count > 0:
                print(f"Successfully added sentiment to {labeled_count} rows")

        except Exception as e:
            print(f"Failed to populate sentiment {e}")
        
        return labeled_count
    
    def parse_sql_value(self, value_string):
        """
        Parse a SQL VALUES tuple like: (1,'Service','Type','2021-02-12',...)
        Returns a list of individual values
        """
        # Remove outer parenthesis
        value_string = value_string.strip('()')
        
        # Use csv reader to handle quoted strings with commas, and escape \\ character
        reader = csv.reader([value_string], quotechar="'", escapechar='\\', skipinitialspace=True)
        
        # Get the first (and only) row, as the reader variable is just an iterator itself and not a list, hence you need to iterate over it to access even just one value
        for row in reader:
            return row
        
        return None

    def __str__(self):
        return f"File Migration #{self.id}"