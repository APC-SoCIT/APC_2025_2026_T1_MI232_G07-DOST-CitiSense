from drf.models import cleaned_feedback, labeled_feedback, SentimentCorrection
from rest_framework import serializers

class CleanedFeedbackSerializer(serializers.ModelSerializer):
    sentiment = serializers.SerializerMethodField()
    labeled_feedback_id = serializers.SerializerMethodField()
    
    class Meta:
        model = cleaned_feedback
        fields = '__all__'

    def get_sentiment(self, obj):
        """Get the sentiment of the current feedback instance from the labeled_feedback model"""
        try:
            return labeled_feedback.objects.get(feedback_id=obj.id).sentiment
        except:
            return None

    def get_labeled_feedback_id(self,obj):
        """Get the ID of the labeled feedback and use it to replace the sentiment"""
        try:
            return labeled_feedback.objects.get(feedback_id=obj.id).id
        except: 
            return None


class LabeledFeedbackSerializer(serializers.ModelSerializer):
    class Meta: 
        model = labeled_feedback
        fields = ['id','sentiment']

class SentimentCorrectionSerializer(serializers.ModelSerializer):
    comments = serializers.CharField(source="labeled_feedback.feedback.comments", read_only=True)
    class Meta:
        model = SentimentCorrection
        fields = "__all__"