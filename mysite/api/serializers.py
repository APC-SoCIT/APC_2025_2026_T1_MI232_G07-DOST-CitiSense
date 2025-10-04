from drf.models import cleaned_feedback, labeled_feedback
from rest_framework import serializers

class CleanedFeedbackSerializer(serializers.ModelSerializer):
    sentiment = serializers.SerializerMethodField()
    
    class Meta:
        model = cleaned_feedback
        fields = '__all__'

    def get_sentiment(self, obj):
        """Get the sentiment of the current feedback instance from the labeled_feedback model"""
        try:
            sentiment = labeled_feedback.objects.get(feedback_id=obj.id).sentiment
        except:
            return None
        
        return sentiment

class LabeledFeedbackSerializer(serializers.ModelSerializer):
    class Meta: 
        model = labeled_feedback
        fields = ['id','sentiment']