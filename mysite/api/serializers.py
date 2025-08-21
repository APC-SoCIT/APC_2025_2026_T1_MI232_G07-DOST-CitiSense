from drf.models import SentimentPost, ArchivePost
from rest_framework import serializers

class SentimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentPost
        fields = ['id','name','service','gender','feedback','sentiment']

class ArchiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivePost
        fields = '__all__'
        read_only_fields = ['author']