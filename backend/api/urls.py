from django.urls import path, include
from .views import CleanedList, LabeledList

urlpatterns = [
    path("cleaned/", CleanedList.as_view(), name="cleaned_feedback"),
    path("labeled/", LabeledList.as_view(), name="labeled_feedback"),
]
