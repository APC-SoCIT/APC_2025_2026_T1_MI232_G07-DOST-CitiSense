from django.urls import path
from . import views
from .views import gauge_chart, CleanedFeedbackList, gender_chart, service_chart, CleanedFeedbackUpdate

urlpatterns = [
    # path("sentimentposts/",views.SentimentPostListCreate.as_view(), name="sentiposts"),
    # path("sentimentposts/<int:pk>/", views.SentimentPostUpdate.as_view(), name="sentipost-update"),
    # path("sentimentposts/count/", sentiment_count, name="senticount"),
    path("sentimentposts/", CleanedFeedbackList.as_view(), name="sentiposts"),
    path("sentimentposts/<int:pk>/", CleanedFeedbackUpdate.as_view(), name="sentiposts_update"),
    path("sentimentposts/gauge/", gauge_chart, name="sentigauge"),
    path("sentimentposts/gen/", gender_chart, name="sentigender"),
    path("sentimentposts/service/", service_chart, name="sentiservice"),
    # path("archive/", views.ArchivePostListCreate.as_view(), name="archiveposts"),
    # path("archive/<int:pk>/", views.ArchivePostListUpdate.as_view(),  name="archivepost-update"),
]