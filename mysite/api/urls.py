from django.urls import path
from . import views
from .views import gauge_chart, CleanedFeedbackList, gender_chart, service_chart, CleanedFeedbackUpdate, dashboard_filter, gender_bar_chart_tooltip, service_bar_chart_tooltip, get_total_feedback, area_chart, get_unique_table_filters, thematic_analysis, SentimentCorrectionList, DeleteSentimentCorrection
urlpatterns = [
    # path("sentimentposts/",views.SentimentPostListCreate.as_view(), name="sentiposts"),
    # path("sentimentposts/<int:pk>/", views.SentimentPostUpdate.as_view(), name="sentipost-update"),
    # path("sentimentposts/count/", sentiment_count, name="senticount"),

    # Data table APIs
    path("sentimentposts/", CleanedFeedbackList.as_view(), name="sentiposts"),
    path("sentimentposts/<int:pk>/", CleanedFeedbackUpdate.as_view(), name="sentiposts_update"),
    path("sentimentposts/tablefilters/", get_unique_table_filters, name="tablefilters"),
    
    # Dashboard and Chart APIs
    path("sentimentposts/gauge/", gauge_chart, name="sentigauge"),
    path("sentimentposts/gen/", gender_chart, name="sentigender"),
    path("sentimentposts/service/", service_chart, name="sentiservice"),
    path("sentimentposts/areachart/", area_chart, name="sentiarea"),
    path("sentimentposts/dashboardfilters/", dashboard_filter, name="dboardfilters"),
    path("sentimentposts/gendertooltip/", gender_bar_chart_tooltip, name="gendertooltip"),
    path("sentimentposts/servicetooltip/", service_bar_chart_tooltip, name="servicetooltip"),
    path("sentimentposts/totalcount/", get_total_feedback, name="total_feedback"),
    path("sentimentposts/themes/", thematic_analysis, name="thematic_analysis"),

    #AI Retrain APIs
    path("sentimentcorrections/", SentimentCorrectionList.as_view(), name="senticorrection"),
    path("sentimentcorrections/<int:pk>/", DeleteSentimentCorrection.as_view(), name="senticorrection_delete")
]