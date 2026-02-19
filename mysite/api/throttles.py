from rest_framework.throttling import UserRateThrottle

class AISummaryThrottle(UserRateThrottle):
    scope = "ai_summarization"