from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SentimentPost(models.Model):

    GENDER_CHOICES = [
        ("M","Male"),
        ("F", "Female")
    ]

    SERVICE_CHOICES = [
        ("Hybrid Seminar", "Hybrid Seminar"),
        ("Material Requests", "Material Requests"),
        ("Online Library", "Online Library"),
        ("Library Tour","Library Tour")
    ]
    name = models.TextField(max_length=100)
    service = models.CharField(max_length=100, choices=SERVICE_CHOICES)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    feedback = models.TextField(max_length=100)
    sentiment = models.TextField(max_length=10)
    
    def __str__(self):
        return self.name
    
class ArchivePost(models.Model):
    title = models.CharField(max_length=50, null=False, blank=False)
    image = models.ImageField(upload_to="dashboardArchive" )
    date_created = models.DateField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)