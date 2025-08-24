from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from dj_rest_auth.registration.serializers import RegisterSerializer

#get the active customUser model in settings.py
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True) #convert the integer to a string representation of the role
    class Meta:
        model = User
        fields = ['id','username', 'email', 'picture', 'groups']

class CustomRegisterUserSerializer(RegisterSerializer):
    #unique validator with a message
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), 
                                                               message="A user with this email already exists.")])