from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from drf.models import cleaned_feedback, labeled_feedback, SentimentCorrection, ModelVersion
from .serializers import CleanedFeedbackSerializer,LabeledFeedbackSerializer, SentimentCorrectionSerializer, ModelVersionSerializer
from rest_framework.decorators import api_view, throttle_classes, permission_classes
from django.db.models import Count, Q, F
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from drf.utils import summarize_text, generate_themes
from django.core.cache import cache
import time
from .throttles import AISummaryThrottle
from transformers import Trainer, AutoModelForSequenceClassification, AutoTokenizer, TrainingArguments
from sklearn.model_selection import train_test_split
from drf.utils import get_active_model_path
from datasets import Dataset
from django.conf import settings
import os
import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

bad_values = {
    "", " ", '', ' ',
    "None", "NONE", "null", "undefined",
    "NA", "N/A", "n/a", "n.a.", "N.A.",
    "na", "n a",
    "none", "NULL",
    "-", "--", "---",
    "not applicable", "not available",
    "no data", "no value",
    "unknown", "tbd",
    "idk", "IDK", "Idk",
    "i dont know", "I dont know", "I don't know",
    "i don't know", "dont know", "dunno",
    "\"\"", '""'
}

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

# Get the current filter for the table using dictionary unpacking
def filter_table_request(request):
    queryset = cleaned_feedback.objects.all()

    # Get the query parameters and store them in variables
    service_name = request.query_params.getlist('service_name')
    quarter = request.query_params.getlist("quarter")
    service_type = request.query_params.getlist("service_type")
    year = request.query_params.getlist("year")
    sex = request.query_params.getlist("sex")
    category = request.query_params.getlist("category")
    typeoflibrary = request.query_params.getlist("typeoflibrary")
    region = request.query_params.getlist("region")
    sentiment = request.query_params.getlist("sentiment")
    comments = request.query_params.get("comments")
    key_takeaways = request.query_params.get("key_takeaways")
    suggestions = request.query_params.get("suggestions")

    # Instantiate a dictionary; this will be used to hold the key/value pairs for the filters
    filter_dict = {}

    # If there is a specific value in the query paramaters, then put it into the dictionary
    # Just add more if statements if you want to add more new filters based on the requirements
    if service_name:
        filter_dict["service_name__in"] = service_name
    if quarter:
        filter_dict["quarter__in"] = quarter
    if service_type:
        filter_dict["service_type__in"] = service_type
    if year:
        filter_dict["year__in"] = year
    if sex:
        filter_dict["sex__in"] = sex
    if category:
        filter_dict["category__in"] = category
    if typeoflibrary:
        filter_dict["typeoflibrary__in"] = typeoflibrary
    if region:
        filter_dict["region__in"] = region
    if sentiment:
        filter_dict["labeled_feedback__sentiment__in"] = sentiment


    # Filter based on what the contents of the dictionary are
    # Default to 0
    queryset = queryset.filter(**filter_dict)

    if comments == "hideEmpty":
        queryset = queryset.exclude(comments__isnull=True).exclude(comments="").exclude(comments=" ")
    if key_takeaways == "hideEmpty":
            queryset = queryset.exclude(key_takeaways__isnull=True).exclude(key_takeaways="").exclude(key_takeaways=" ")
    if suggestions == "hideEmpty":
            queryset = queryset.exclude(suggestions__isnull=True).exclude(suggestions="").exclude(suggestions=" ")

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
    
    def get_queryset(self):
        return filter_table_request(self.request)

class CleanedFeedbackUpdate(generics.RetrieveUpdateAPIView):
    queryset = labeled_feedback.objects.all()
    serializer_class = LabeledFeedbackSerializer
    permission_classes = [IsAnalyst, IsAuthenticated]
    
    # To automatically update/populate the last_modified_by field when editing a sentiment
    def perform_update(self, serializer):
        instance = self.get_object()
        old_sentiment = instance.sentiment

        updated_instance = serializer.save(last_modified_by=self.request.user)

        if old_sentiment and updated_instance.sentiment != old_sentiment:
            SentimentCorrection.objects.update_or_create(
                labeled_feedback = updated_instance,
                defaults={
                    "original_sentiment": old_sentiment,
                    "corrected_sentiment": updated_instance.sentiment,
                    "corrected_by": self.request.user,
                    "status": "pending",
                },
            )

class SentimentCorrectionList(generics.ListAPIView):
    serializer_class = SentimentCorrectionSerializer
    permission_classes = [IsAnalyst, IsAuthenticated]

    def get_queryset(self):
        queryset = SentimentCorrection.objects.filter(status="pending")
        return queryset
    
class DeleteSentimentCorrection(generics.DestroyAPIView):
    queryset = SentimentCorrection.objects.all()
    serializer_class = SentimentCorrectionSerializer
    permission_classes = [IsAnalyst, IsAuthenticated]

class ViewModelList(generics.ListAPIView):
    serializer_class = ModelVersionSerializer
    permission_classes = [IsAuthenticated]

class ActivateModelVersion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        version = ModelVersion.objects.get(pk=pk)
        version.activate()
        return Response({"status": "Activated", "version": version.version_name})

class ViewModelList(generics.ListAPIView):
    serializer_class = ModelVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ModelVersion.objects.all()
        is_active = self.request.query_params.get("is_active")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def FineTuneAIModel(request):
    model_name = request.data.get("model_name")

    if not model_name:
        return Response({"error": "Model name is required"}, status=400)

    if ModelVersion.objects.filter(version_name=model_name).exists():
        return Response({"error": f"A model version named '{model_name}' already exists"}, status=400)

    data = SentimentCorrection.objects.filter(status="pending").values(
        "labeled_feedback__feedback__comments", "corrected_sentiment"
    )

    if not data.exists():
        return Response({"error": "No pending corrections to train on"}, status=400)

    # Capture the correction ids used for updating the status to "used" later.
    correction_ids = list(SentimentCorrection.objects.filter(status="pending").values_list("id", flat=True))

    sentiment_map = {"Negative": 0, "Positive": 1, "Neutral": 2}

    texts = []
    labels = []

    for row in data: 
        comment = row["labeled_feedback__feedback__comments"]
        sentiment = row["corrected_sentiment"]

        if not comment or not comment.strip():
            continue # Skip corrections with no actual text to train/fine-tune on.

        texts.append(comment.strip())
        labels.append(sentiment_map[sentiment])

    if len(texts) < 100:
        return Response({"error": "Not enough samples to train on (minimum 100 required)."}, status=400)

    # 80/20 train/test split 
    x_train, x_test, y_train, y_test = train_test_split(texts, labels, test_size=0.20, random_state=42, stratify=labels)

    # Reference from this point onward: https://huggingface.co/docs/transformers/v4.41.1/training
    base_model_path = get_active_model_path()
    tokenizer = AutoTokenizer.from_pretrained(base_model_path)
    model = AutoModelForSequenceClassification.from_pretrained(base_model_path)

    def tokenize(batch):
        return tokenizer(batch["text"], truncation=True, max_length=255, padding="max_length")

    # Convert the dataset to a dictionary to be put in the trainer of HuggingFace
    train_data = Dataset.from_dict({"text": x_train, "label": y_train}).map(tokenize, batched=True)
    test_data = Dataset.from_dict({"text": x_test, "label": y_test}).map(tokenize, batched=True)

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)

        accuracy = accuracy_score(labels, predictions)
        cm = confusion_matrix(labels, predictions)  # rows = actual, cols = predicted
        report = classification_report(labels, predictions, output_dict=True)  # precision/recall/f1 per class

        return {
            "accuracy": accuracy,
            "confusion_matrix": cm.tolist(),
            "classification_report": report,
        }

    training_args = TrainingArguments(output_dir=settings.SENTIMENT_MODELS_DIR / "checkpoints", save_strategy="no")

    # Finally fine-tune and test  the model
    trainer = Trainer(model=model, args=training_args, train_dataset=train_data, eval_dataset=test_data, compute_metrics=compute_metrics)
    trainer.train()
    test_results = trainer.evaluate()

    # Convert numpy numbers to plain python numbers to be saved in the eval_results field of the ModelVersion field.
    test_results = {k: (float(v) if isinstance(v, (np.floating, np.integer)) else v) for k, v in test_results.items()}

    v2_path = os.path.join(settings.SENTIMENT_MODELS_DIR, model_name)
    model.save_pretrained(v2_path)
    tokenizer.save_pretrained(v2_path)

    v2 = ModelVersion.objects.create(
        version_name= model_name,
        model_path=v2_path,
        samples_used=len(texts),        
        eval_results=test_results,
    )

    corrections_used = SentimentCorrection.objects.filter(id__in=correction_ids)
    v2.trained_on_corrections.set(corrections_used)

    v2.activate()

    corrections_used.update(status="used")

    return Response({"status": "completed", "train_samples": len(train_data), "test_samples": len(test_data), "eval_results": test_results})
    

@api_view(['GET'])
def get_unique_table_filters(request):
    quarter = cleaned_feedback.objects.values_list('quarter', flat=True).distinct()
    service_name = cleaned_feedback.objects.values_list("service_name", flat=True).distinct()
    service_type = cleaned_feedback.objects.values_list('service_type', flat=True).distinct()
    year = cleaned_feedback.objects.values_list('year', flat=True).distinct()
    sex = cleaned_feedback.objects.values_list('sex', flat=True).distinct()
    category = cleaned_feedback.objects.values_list('category', flat=True).distinct()
    typeoflibrary = cleaned_feedback.objects.values_list('typeoflibrary', flat=True).distinct()
    region = cleaned_feedback.objects.values_list('region', flat=True).distinct()
    sentiment = cleaned_feedback.objects.values_list('labeled_feedback__sentiment', flat=True).distinct()


    return Response({
        "quarter": quarter,
        "service_name": service_name,
        "service_type": service_type,
        "year": year,
        "sex": sex,
        "category": category,
        "typeoflibrary": typeoflibrary,
        "region": region,
        "sentiment": sentiment,
    })

@api_view(['GET'])
def get_total_feedback(request):
    queryset = filter_dashboard_request(request)
    totalcount = queryset.count()

    return Response({"totalcount": totalcount})
 
# Get the unique values for the filters in the dashboard to be sent to the frontend
@api_view(['GET'])
def dashboard_filter(request):
    queryset = cleaned_feedback.objects
    service_name = queryset.filter(service_name__isnull=False).exclude(service_name__in=bad_values).values_list("service_name", flat=True).distinct()
    service_type = queryset.filter(service_type__isnull=False).exclude(service_type__in=bad_values).values_list("service_type", flat=True).distinct()
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
    queryset = filter_dashboard_request(request).filter(sentiment__isnull=False, feedback__sex__isnull=False)
    gendercount = queryset.values('sentiment', sex=F('feedback__sex')).annotate(sencount=Count('sentiment'))
    return Response({"genderCount" : gendercount})

@api_view(['GET'])
def service_chart(request):
    queryset = filter_dashboard_request(request).filter(sentiment__isnull=False)
    servicecount = queryset.values('sentiment', service=F('feedback__service_type')).annotate(sencount=Count('sentiment'))
    return Response({"serviceCount": servicecount})

@api_view(["GET"])
def area_chart(request):
    queryset = filter_dashboard_request(request).filter(sentiment__isnull=False, feedback__created_at__isnull=False)
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
@throttle_classes([AISummaryThrottle])
def gender_bar_chart_tooltip(request):
    queryset = filter_dashboard_request(request)

    start_time = time.time()

    # Get the limit and offset based on the API, default to 10 for the limit, and max 1k rows, offset is always 0.
    limit = min(int(request.query_params.get("limit", 10)), 1000)
    offset = 0

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
@throttle_classes([AISummaryThrottle])
def service_bar_chart_tooltip(request):
    queryset = filter_dashboard_request(request)

    # Get the limit and offset based on the API, default to 10 for the limit and max is 1k rows, offset is always 0.
    limit = min(int(request.query_params.get("limit", 10)), 1000)
    offset = 0

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

@api_view(["GET"])
@throttle_classes([AISummaryThrottle])
def thematic_analysis(request):
    queryset = filter_dashboard_request(request)

    # Get the limit and offset based on the API, default to 10 for the limit, and max 1k rows, offset is always 0.
    limit = min(int(request.query_params.get("limit", 10)), 1000)
    offset = 0

    # Get the suggestions column filtered out of null and bad values (e.g., null, undefined, "")
    filtered_suggestions = queryset.filter(feedback__suggestions__isnull=False).exclude(feedback__suggestions__in=bad_values).values_list("feedback__suggestions", flat=True)
    
    suggestions_queryset = filtered_suggestions[offset:offset+limit]
    
    # Convert the suggestions_queryset to one big string for thematic analysis/topic labeling
    suggestions_list = " ".join(suggestions_queryset)
    
    start_time = time.time()
    print(f"Starting thematic analysis for {suggestions_list} for {request.GET}")

    # Generate a cache key and get the values for the current key if it already exists in the memory
    # Else, calculate new themes for the newly selected filters and rows (limit)
    cache_key = f"themes{hash(str(request.GET))}"
    cached_result = cache.get(cache_key)
    if cached_result:
        return Response(cached_result)

    # Generate themes and return a dictionary
    try:
        themes = generate_themes(suggestions_list)

        if not isinstance(themes, dict) or "themeCount" not in themes:
            raise ValueError("Invalid theme structure")

    except Exception as e:
        return Response(
            {
                "error": "Theme generation failed",
                "details": str(e)
            },
            status=500
        )

    end_time = time.time()
    completed_time = end_time - start_time
    print(f"Time completed: {completed_time:.2f}")

    # Set the cache for 1 hour
    cache.set(cache_key, themes, 3600)

    return Response(themes)
    

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

