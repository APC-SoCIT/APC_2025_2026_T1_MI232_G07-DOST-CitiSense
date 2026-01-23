from drf.models import cleaned_feedback, labeled_feedback
from django.core.management.base import BaseCommand
from faker import Faker
import random 
from django.contrib.auth import get_user_model

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = "Populate only cleaned_feedback, used in conjunction with populate_sentiment; for testing"

    def handle(self, *args, **kwargs):
        SERVICENAME_CHOICES = ["Library Seminar: Information Institutions", "Sustainability in Libraries: Green Practices for Information Institutions"]
        GENDER_CHOICES = ["Male", "Female"]
        SERVICETYPE_CHOICES = ["HAHAAHAHHAA", "EWAN KO LANG"]
        SENTIMENT_CHOICES = ["Positive", "Negative", "Neutral"]
        QUARTER_CHOICES = ["First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter"]
        TYPEOFLIBRARY_CHOICES = ["Non-library Institution", "Academic Library", "School Library", "Public Library"]
        CATEGORY_CHOICES = ["Librarian/Library Staff", "Students", "Administrative Officer / Administrative Staff", "Teachers / Teaching Personnel / Professors"]
        REGION_CHOICES = [
            "NCR", "CAR", "Region I", "Region II", "Region III", "Region IV-A", "MIMAROPA",
            "Region V", "Region VI", "Region VII", "Region VIII", "Region IX",
            "Region X", "Region XI", "Region XII", "Region XIII", "BARMM"
        ]


        try:
            # Get the list of all users
            users = list(User.objects.all())

            x = 100
            
            # Make x rows of fake data
            for _ in range(x):
                feedback_instance = cleaned_feedback.objects.create(
                    service_name= random.choice(SERVICENAME_CHOICES),
                    service_type = random.choice(SERVICETYPE_CHOICES),
                    timestamp = fake.date_time_between(start_date="-5y", end_date="now"),
                    quarter = random.choice(QUARTER_CHOICES),
                    year = (fake.date_time_between(start_date="-5y", end_date="now").year),
                    sex = random.choice(GENDER_CHOICES),
                    category = random.choice(CATEGORY_CHOICES),
                    typeoflibrary = random.choice(TYPEOFLIBRARY_CHOICES),
                    region = random.choice(REGION_CHOICES),
                    key_takeaways = fake.sentence(),
                    comments = fake.sentence(),
                    suggestions = fake.sentence(),
                    created_at = fake.date_time_between(start_date="-2y", end_date="now"),
                    updated_at = fake.date_time_between(start_date="-1y", end_date="now"),
                )


            self.stdout.write(self.style.SUCCESS(f"Successfully populated cleaned_feedback with {x} rows!"))     
                
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error populating MySQL: {e}"))