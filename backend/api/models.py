from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class cleaned_feedback(models.Model):
    service_name = models.CharField(max_length=255, null=True, blank=True)
    service_type = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)
    quarter = models.CharField(max_length=255, null=True, blank=True)
    year = models.SmallIntegerField(null=True, blank=True)
    sex = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=255, null=True, blank=True)
    typeoflibrary = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(max_length=255, null=True, blank=True)
    key_takeaways = models.TextField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    suggestions = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

class labeled_feedback(models.Model):
    feedback = models.ForeignKey(cleaned_feedback, on_delete=models.CASCADE)
    sentiment = models.CharField(max_length=255, null=True, blank= True)
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
