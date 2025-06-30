from .models import SentimentPost


def count():
    count_senti = SentimentPost.objects.all().count()
    return count_senti