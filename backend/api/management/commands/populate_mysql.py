from api.models import cleaned_feedback, labeled_feedback
from django.core.management.base import BaseCommand
from faker import Faker
import random 
from django.contrib.auth.models import User

fake = Faker()

class Command(BaseCommand):
    help = "Populate MySQL database with fake data"

    def handle(self, *args, **kwargs):
        SERVICENAME_CHOICES = ["Library Seminar: Information Institutions", "Sustainability in Libraries: Green Practices for Information Institutions"]
        GENDER_CHOICES = ["Male", "Female"]
        SERVICETYPE_CHOICES = ["Hybrid Seminar", "Material Requests", "Online Library", "Library Tour"]
        SENTIMENT_CHOICES = ["Positive", "Negative", "Neutral"]
        SESSION_CHOICES = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]
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

            # Make 100 rows of fake data and sentiment applied to it
            for _ in range(100):
                feedback_instance = cleaned_feedback.objects.create(
                    service_name= random.choice(SERVICENAME_CHOICES),
                    service_type = random.choice(SERVICETYPE_CHOICES),
                    timestamp = fake.date_time_between(start_date="-5y", end_date="now"),
                    quarter = random.choice(SESSION_CHOICES),
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

                labeled_feedback.objects.create(
                    feedback = feedback_instance,
                    sentiment = random.choice(SENTIMENT_CHOICES),
                    created_at = fake.date_time_between(start_date="-2y", end_date="now"),
                    updated_at = fake.date_time_between(start_date="-1y", end_date="now"),
                    last_modified_by = random.choice(users) if users and random.random() > 0.5 else None
                )

            self.stdout.write(self.style.SUCCESS(f"Successfully populated MySQL with 100 rows!"))     
                
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error populating MySQL: {e}"))