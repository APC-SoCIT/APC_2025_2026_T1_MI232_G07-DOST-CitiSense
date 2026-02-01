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
from drf.utils import summarize_text
from django.core.cache import cache
import hashlib

# Get the current filter for the dashboard using dictionary unpacking
def filter_dashboard_request(request):
    queryset = labeled_feedback.objects.all()

    # Get the query parameters from either the service_name, service_type, or quarter in the URL.
    service_name = request.query_params.getlist('service_name')
    quarter = request.query_params.getlist("quarter")
    service_type = request.query_params.getlist("service_type")
    from_date = request.query_params.get("from")
    to_date = request.query_params.get("to")

    # Instantiate a dictionary; this will be used to hold the key/value pairs for the filters
    filter_dict = {}

    # If there is a service_name, quarter, and/or service_type in the query paramaters, then put it into the dictionary
    # Just add more if statements if you want to add more new filters based on the requirements
    if service_name:
        filter_dict["feedback__service_name__in"] = service_name
    if quarter:
        filter_dict["feedback__quarter__in"] = quarter
    if service_type:
        filter_dict["feedback__service_type__in"] = service_type
    if from_date:
        # Split the text and remove the time field, just get the specific date
        filter_dict["feedback__created_at__gte"] = from_date.split('T')[0]
    if to_date:
        # Split the text and remove the time field, just get the specific date
        filter_dict["feedback__created_at__lte"] = to_date.split('T')[0]
        
    # Filter based on what the contents of the dictionary are
    # Default to 0
    return queryset.filter(**filter_dict)

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

# @api_view(['GET'])
# def gender_bar_chart_tooltip(request):
#     queryset = filter_dashboard_request(request)
#     comments = list(queryset.values_list("feedback__comments", flat=True)[:1])

#     response = summarize_text(comments)
#     return Response({"response": response})


# @api_view(['GET'])
# def service_bar_chart_tooltip(request):
#     queryset = filter_dashboard_request(request)
#     comments = list(queryset.values_list("feedback__comments", flat=True)[:1])

#     response = summarize_text(comments)
#     return Response({"response": response})

@api_view(['GET'])
def get_total_feedback(request):
    queryset = filter_dashboard_request(request)
    totalcount = queryset.count()

    return Response({"totalcount": totalcount})

@api_view(['GET'])
def service_bar_chart_tooltip(request):
    data = {
    "serviceTooltip": [
        {
            "sentiment": "Positive",
            "service": "Material Requests",
            "summary": "Material Requests service receives positive feedback from users."
        },
        {
            "sentiment": "Positive",
            "service": "Library Tour",
            "summary": "Library Tour participants find the experience informative and welcoming."
        },
        {
            "sentiment": "Negative",
            "service": "Hybrid Seminar",
            "summary": "Hybrid Seminar attendees express concerns about technical issues and engagement."
        },
        {
            "sentiment": "Positive",
            "service": "Hybrid Seminar",
            "summary": "Hybrid Seminar attendees appreciate the flexibility and content quality."
        },
        {
            "sentiment": "Negative",
            "service": "Online Library",
            "summary": "Online Library users report difficulties with navigation and accessibility."
        },
        {
            "sentiment": "Negative",
            "service": "Material Requests",
            "summary": "Material Requests service faces criticism for slow processing times."
        },
        {
            "sentiment": "Neutral",
            "service": "Hybrid Seminar",
            "summary": "Hybrid Seminar receives mixed or neutral feedback from participants."
        },
        {
            "sentiment": "Neutral",
            "service": "Library Tour",
            "summary": "Library Tour attendees provide moderate feedback with room for improvement."
        },
        {
            "sentiment": "Negative",
            "service": "Library Tour",
            "summary": "Library Tour participants express dissatisfaction with pacing and coverage."
        },
        {
            "sentiment": "Neutral",
            "service": "Material Requests",
            "summary": "Material Requests service receives neutral feedback from users."
        },
        {
            "sentiment": "Neutral",
            "service": "Online Library",
            "summary": "Online Library users provide moderate feedback about the platform."
        },
        {
            "sentiment": "Positive",
            "service": "Online Library",
            "summary": "Online Library users find it a positive and helpful resource."
        }
    ]
}
    return Response(data)

@api_view(['GET'])
def gender_bar_chart_tooltip(request):
    data = {
        "genderTooltip": [
            {
                "sentiment": "Positive",
                "sex": "Male",
                "summary": "Male users are generally satisfied with the service and appreciate the smooth experience and helpful features."
            },
            {
                "sentiment": "Positive",
                "sex": "Female",
                "summary": "Female users highlight good service quality, fast processing, and a pleasant overall experience."
            },
            {
                "sentiment": "Negative",
                "sex": "Male",
                "summary": "Male users report delays, confusing steps, and occasional issues that made the process frustrating."
            },
            {
                "sentiment": "Negative",
                "sex": "Female",
                "summary": "Female users mention slow responses, unclear instructions, and problems that affected their experience."
            },
            {
                "sentiment": "Neutral",
                "sex": "Female",
                "summary": "Female feedback is mixed, with comments describing the process as average and suggesting minor improvements."
            },
            {
                "sentiment": "Neutral",
                "sex": "Male",
                "summary": "Male feedback is mostly balanced, noting that the service works but could be clearer and more consistent."
            }
        ]
    }

    return Response(data)

# Get the unique values for the filters in the dashboard to be sent to the frontend
@api_view(['GET'])
def dashboard_filter(request):
    queryset = cleaned_feedback.objects.values_list
    service_name = queryset("service_name", flat=True).distinct()
    service_type = queryset("service_type", flat=True).distinct()
    return Response({"service_name": service_name, "service_type": service_type})

@api_view(['GET'])
def gauge_chart(request):
    queryset = filter_dashboard_request(request)
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
    queryset = filter_dashboard_request(request)
    gendercount = queryset.values('sentiment', sex=F('feedback__sex')).annotate(sencount=Count('sentiment'))
    return Response({"genderCount" : gendercount})

@api_view(['GET'])
def service_chart(request):
    queryset = filter_dashboard_request(request)
    servicecount = queryset.values('sentiment', service=F('feedback__service_type')).annotate(sencount=Count('sentiment'))
    return Response({"serviceCount": servicecount})
