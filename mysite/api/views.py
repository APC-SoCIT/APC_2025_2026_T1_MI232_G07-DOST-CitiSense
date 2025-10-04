from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from drf.models import cleaned_feedback, labeled_feedback
from .serializers import CleanedFeedbackSerializer,LabeledFeedbackSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.db.models import Count, Q, F
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

def filter_sentiment_queryset(request):
    queryset = labeled_feedback.objects.all()
    quarter = request.query_params.getlist("quarter")

    if len(quarter) > 0:
        queryset = queryset.filter(feedback__quarter__in=quarter)
    return queryset

class IsAuthorOnly(permissions.BasePermission):
    #this only allows the authors of the dashboard to view, and update or delete their own archive image
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class IsAnalyst(permissions.BasePermission):
    #only show the data and allow edit updates to it, if the user is an analyst
    def has_permission(self, request, view):
        return request.user.groups.filter(name="analyst").exists()


# class SentimentPostUpdate(generics.RetrieveUpdateDestroyAPIView):
#     queryset = SentimentPost.objects.all()
#     serializer_class = SentimentSerializer
#     # permission_classes = [IsAuthenticated, IsAnalyst]

class CleanedFeedbackList(generics.ListCreateAPIView):
    queryset = cleaned_feedback.objects.all()
    serializer_class = CleanedFeedbackSerializer

class CleanedFeedbackUpdate(generics.RetrieveUpdateAPIView):
    queryset = labeled_feedback.objects.all()
    serializer_class = LabeledFeedbackSerializer
    permission_classes = [IsAnalyst, IsAuthenticated]

@api_view(['GET'])
def gauge_chart(request):
    queryset = filter_sentiment_queryset(request)
    senticounts = queryset.aggregate(
        positive = Count("id", filter=Q(sentiment="Positive")),
        negative =Count("id", filter=Q(sentiment="Negative")),
        neutral = Count("id", filter=Q(sentiment="Neutral")),
        total_count = Count("id") 
    )
    
    #zero division error check; fallback to 0 
    total = senticounts['total_count']
    if total > 0: 
        gauge_percentage = ((senticounts['positive'] * 100 + senticounts['negative'] * 0 + senticounts['neutral'] * 50) / senticounts['total_count'])
    else: 
        gauge_percentage = 0
    return Response({"Gauge percentage": gauge_percentage})

@api_view(['GET'])
def gender_chart(request): 
    queryset = filter_sentiment_queryset(request)
    gendercount = queryset.values('sentiment', sex=F('feedback__sex')).annotate(sencount=Count('sentiment'))
    return Response({"genderCount" : gendercount})

@api_view(['GET'])
def service_chart(request):
    queryset = filter_sentiment_queryset(request)
    servicecount = queryset.values('sentiment', service=F('feedback__service_type')).annotate(sencount=Count('sentiment'))
    return Response({"serviceCount": servicecount})
