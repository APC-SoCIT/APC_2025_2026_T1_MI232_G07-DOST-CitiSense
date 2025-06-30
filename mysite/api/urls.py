from django.urls import path
from . import views
from .views import sentiment_count, gauge_chart

urlpatterns = [
    path("sentimentposts/",views.SentimentPostListCreate.as_view(), name="sentiposts"),
    path("sentimentposts/gen/", sentiment_count, name="sentigender"),
    path("sentimentposts/gauge/", gauge_chart, name="sentigauge")

]