from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from drf.models import cleaned_feedback, labeled_feedback
from .serializers import CleanedFeedbackSerializer,LabeledFeedbackSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.db.models import Count, Q, F, Min
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from drf.utils import summarize_text
from django.core.cache import cache
import hashlib
import time

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



@api_view(['GET'])
def get_total_feedback(request):
    queryset = filter_dashboard_request(request)
    totalcount = queryset.count()

    return Response({"totalcount": totalcount})

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

@api_view(["GET"])
def area_chart(request):
    queryset = filter_dashboard_request(request)
    areacount = list(queryset.values('sentiment', date_created=F("feedback__created_at")))

    # Initialize a dictionary to hold the API shape for the area chart
    areacount_dict = {}

    for row in areacount: 
        # For each row in the response, convert each into string and remove the time from the date. Final transformation will look like 2025-12-3
        date_str = row["date_created"].isoformat().split("T")[0]
        # Create a key for the dictionary using only the sentiment
        sentiment = row["sentiment"]
        
        if sentiment not in areacount_dict:
            areacount_dict[sentiment] = {
                "name": row["sentiment"],
                "data": [],
                "date_counts": {},
            }
        
        # Check if the date already exists in the date_counts
        if date_str in areacount_dict[sentiment]["date_counts"]:
            # Increment by one if the current date has appeared before
            areacount_dict[sentiment]["date_counts"][date_str] += 1
        else:
            # If it's the first time for the date to appear, start the count at 1
            areacount_dict[sentiment]["date_counts"][date_str] = 1
        
        # Get the current total count for the date within this loop
        count = areacount_dict[sentiment]["date_counts"][date_str]

    for sentiment in areacount_dict:
        # Append the date and the total count for each date to the data list
        for date, count in areacount_dict[sentiment]["date_counts"].items():
            areacount_dict[sentiment]["data"].append([date, count])

        # Sort by date; x[0] because the index 0 is the date value
        areacount_dict[sentiment]["data"].sort(key=lambda x: x[0])
        # Additionally, after the for loop, delete the date_counts dictionary, this is not needed for the API response
        del areacount_dict[sentiment]["date_counts"]

    areacount_list = list(areacount_dict.values())
    return Response({"areaCount": areacount_list})

@api_view(['GET'])
def gender_bar_chart_tooltip(request):
    queryset = filter_dashboard_request(request)

    start_time = time.time()

    # Get the limit and offset based on the API, default to 200 for the limit, offset is always 0.
    limit = int(request.query_params.get("limit", 200))
    offset = int(request.query_params.get("offset",0))

    # Generate a cache key from the request's filter parameters
    # If there is a cache key already used with, use that and don't compute for summarization anymore
    cache_key = f"gender_tooltip_{hash(str(request.GET))}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return Response({"genderTooltip": cached_result})

    # Convert the queryset to a list so you can modify it in place
    response = list(queryset[offset:offset+limit].values("sentiment", sex=F("feedback__sex"), summary=F("feedback__comments")))
   
   # Initialize a dictionary to hold the new shape of the API
    response_dict = {}

    for row in response:
        # Generate a key from the sentiment and sex (e.g., key = Positive_Male)
        key = f"{row['sentiment']}_{row['sex']}"

        # If the key is not in the dictionary yet, then insert it with the values taken from the response
        if key not in response_dict:
            response_dict[key] = {
                "sentiment": row["sentiment"],
                "sex": row["sex"],
                "summary": row["summary"],
                "count": 1
            }
        else: 
            # Append the summary to the current row sentiment and sex's summary
            response_dict[key]["summary"] += ", " + row["summary"]
            response_dict[key]["count"] += 1

    response_list = list(response_dict.values())

    for row in response_list:
        if row["summary"] is not None:
        # Access the current and get the summary/comments value, then
        # Update the value of the summary, by putting the comments through the AI model
            row["summary"] = summarize_text(row["summary"])
    
    # If there isn't a cache for the gender response, then cache the response, and set the cache_key as the identifier.
    cache.set(cache_key, response_list, 3600)

    end_time = time.time()
    completed_time = end_time - start_time
    print(f"Time completed: {completed_time:.2f} for gendertooltip")
    return Response({"genderTooltip": response_list})

@api_view(['GET'])
def service_bar_chart_tooltip(request):
    queryset = filter_dashboard_request(request)

    # Get the limit and offset based on the API, default to 200 for the limit, offset is always 0.
    limit = int(request.query_params.get("limit", 200))
    offset = int(request.query_params.get("offset",0))

    start_time = time.time()

    # Generate a cache key from the request's filter parameters
    # If there is a cache key already used with, use that and don't compute for summarization anymore
    cache_key = f"serviceTooltip{hash(str(request.GET))}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return Response({"serviceTooltip": cached_result})
    
    # Convert the queryset to a list so you can modify it in place
    response = list(queryset[offset:offset+limit].values("sentiment", service=F("feedback__service_type"), summary=F("feedback__comments")))
    
    # Initialize a dictionary to hold the new shape of the API
    response_dict = {}

    for row in response:
        # Generate a key from the sentiment and service (e.g., key = Positive_Hybrid Seminar)
        key = f"{row['sentiment']}_{row['service']}"

        if key not in response_dict:
            response_dict[key] ={
                "sentiment": row["sentiment"],
                "service": row["service"],
                "summary": row["summary"],
                "count": 1
            }
        else:
            # Append the summary to the current row sentiment and service's summary
            response_dict[key]["summary"] += ", " + row["summary"]
            response_dict[key]["count"] += 1

    response_list = list(response_dict.values())

    for row in response_list: 
        # For each row in the response list, access and update the summary with the AI model's response
        row["summary"] = summarize_text(row["summary"])

    # If there isn't a cache for the service response, then cache the response, and set the cache_key as the identifier.
    cache.set(cache_key, response_list, 3600)

    end_time = time.time()
    completed_time = end_time - start_time
    print(f"Time completed: {completed_time} for service tooltip")

    return Response({"serviceTooltip": response_list})

#summarize_text()

# @api_view(['GET'])
# def gender_bar_chart_tooltip(request):
#     queryset = filter_dashboard_request(request)

#     # first_ids = queryset.values("sentiment", "feedback__sex").annotate(first_id=Min("id")).values_list("first_id", flat=True)
#     first_ids = queryset.values("sentiment", "feedback__sex", "feedback__comments")
#     response = queryset.filter(id__in=first_ids).values("sentiment", sex=F("feedback__sex"), summary=F("feedback__comments"))

#     return Response({ "firstIds": first_ids, "genderTooltip": response})

# @api_view(['GET'])
# def service_bar_chart_tooltip(request):
#     queryset = filter_dashboard_request(request)

#     first_ids = queryset.values("sentiment", "feedback__service_type").annotate(first_id=Min("id")).values_list("first_id", flat=True)
#     response = queryset.filter(id__in=first_ids).values("sentiment", service=F("feedback__service_type"), summary=F("feedback__comments"))

#     return Response({"serviceTooltip": response})

