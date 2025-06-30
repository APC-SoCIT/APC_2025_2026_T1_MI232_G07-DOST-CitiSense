from drf.models import SentimentPost
from rest_framework import serializers

class SentimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentPost
        fields = ['id','name','service','gender','feedback','sentiment']
    