from django.shortcuts import render
from rest_framework import generics
from .models import cleaned_feedback, labeled_feedback
from .serializers import CleanedFeedbackSerializer, LabeledFeedbackSerializer
# Create your views here.

class CleanedList(generics.ListCreateAPIView):
    queryset = cleaned_feedback.objects.all()
    serializer_class = CleanedFeedbackSerializer


class LabeledList(generics.ListCreateAPIView):
    queryset = labeled_feedback.objects.all()
    serializer_class = LabeledFeedbackSerializer
    