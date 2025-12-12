from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from django.conf import settings
#get the active customUser model in settings.py
User = get_user_model()
from .forms import CustomAllAuthPasswordResetForm

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True, required=False) #convert the integer to a string representation of the role
    picture = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})
    picture_file = serializers.ImageField(required=False, allow_null=False)
    class Meta:
        model = User
        fields = ['id','username', 'password','email', 'picture', 'groups', 'first_name', 'last_name', 'picture_file']
    
    #prepend the domain to the file path to serve to the frontend
    def get_picture(self, obj):
        return self.context['request'].build_absolute_uri(obj.get_user_picture())
        
class CustomRegisterUserSerializer(RegisterSerializer):
    #unique validator with a message
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), 
                                                               message="A user with this email already exists.")])
    
# Reference: https://github.com/iMerica/dj-rest-auth/issues/308#issuecomment-924092699
# https://github.com/iMerica/dj-rest-auth/blob/be436756793140621c6d6b1e82ba459676090b43/dj_rest_auth/serializers.py#L225
# Uses the custom password reset form
class CustomPasswordResetSerializer(PasswordResetSerializer):
    @property
    def password_reset_form_class(self):
        return CustomAllAuthPasswordResetForm