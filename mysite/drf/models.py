from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

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
    year = models.SmallIntegerField(null=True, blank=True)
    sex = models.CharField(max_length=255, null=True, blank=True, choices=SEX_CHOICES)
    category = models.CharField(max_length=255, null=True, blank=True, choices=CATEGORY_CHOICES)
    typeoflibrary = models.CharField(max_length=255, null=True, blank=True, choices=TYPEOFLIBRARY_CHOICES)
    region = models.CharField(max_length=255, null=True, blank=True, choices=REGION_CHOICES)
    key_takeaways = models.TextField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    suggestions = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

class labeled_feedback(models.Model):
    SENTIMENT_CHOICES = [
        ("Positive", "Positive"),
        ("Neutral", "Neutral"),
        ("Negative", "Negative"),
    ]

    feedback = models.ForeignKey(cleaned_feedback, on_delete=models.CASCADE)
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
        return super().save(*args, **kwargs)