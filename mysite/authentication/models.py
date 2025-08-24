from django.contrib.auth.models import AbstractUser
from django.db import models 
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, error_messages={"unique": "A user with this email already exists."})
    picture = models.URLField(null=True, blank=True)
    username = models.CharField(max_length=150, unique=True, validators=[RegexValidator(regex = r"^[\w.@+\- ]+\Z", 
                                                                                        message='"Required. 150 characters or fewer. Letters, digits, spaces and @/./+/-/_ only."',
)])