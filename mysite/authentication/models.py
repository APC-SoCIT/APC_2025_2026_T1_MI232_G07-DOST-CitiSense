from django.contrib.auth.models import AbstractUser
from django.db import models 
from django.core.validators import RegexValidator
from django.conf import settings

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, error_messages={"unique": "A user with this email already exists."})
    picture_url = models.URLField(null=True, blank=True)
    picture_file = models.ImageField(upload_to="profile_picture", null=True, blank=True)
    username = models.CharField(max_length=150, unique=True, validators=[RegexValidator(regex = r"^[\w.@+\- ]+\Z", 
                                                                                        message='"Required. 150 characters or fewer. Letters, digits, spaces and @/./+/-/_ only."',
)])
    def get_user_picture(self): 
        "Returns the profile picture of the user"
        if self.picture_file:
            return self.picture_file.url
        elif self.picture_url: 
            return self.picture_url
        else: 
            return settings.DEFAULT_AVATAR_URL