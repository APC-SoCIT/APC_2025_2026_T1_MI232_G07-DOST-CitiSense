from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from drf.models import SentimentPost, ArchivePost
from .serializers import SentimentSerializer, ArchiveSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.db.models import Count, Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions


class IsAuthorOnly(permissions.BasePermission):
    #this only allows the authors of the dashboard to view, and update or delete their own archive image
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class SentimentPostListCreate(generics.ListCreateAPIView):
    queryset = SentimentPost.objects.all()
    serializer_class = SentimentSerializer

class SentimentPostUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = SentimentPost.objects.all()
    serializer_class = SentimentSerializer

class ArchivePostListCreate(generics.ListCreateAPIView):
    queryset = ArchivePost.objects.all()
    serializer_class = ArchiveSerializer
    permission_classes = [IsAuthenticated]
    
    #only show archived images from their respective authors
    def get_queryset(self):
        user = self.request.user
        return ArchivePost.objects.filter(author=user)
    
    #make requests on behalf of the currently logged in user
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ArchivePostListUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = ArchivePost.objects.all()
    serializer_class = ArchiveSerializer
    permission_classes = [IsAuthorOnly]

@api_view(['GET'])
def sentiment_count(request):
    sentimentcount = SentimentPost.objects.values('sentiment').annotate(sencount=Count('sentiment'))
    senticounts = SentimentPost.objects.aggregate(
        positive = Count("id", filter=Q(sentiment="Positive")),
        negative =Count("id", filter=Q(sentiment="Negative")),
        neutral = Count("id", filter=Q(sentiment="Neutral")),
        total_count = Count("id") 
    )
    formattedsentiment = {item['sentiment']: item['sencount'] for item in sentimentcount}
    return Response({'service_counts': formattedsentiment})
    

@api_view(['GET'])
def gauge_chart(request):
    senticounts = SentimentPost.objects.aggregate(
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
    gendercount = SentimentPost.objects.values('gender','sentiment').annotate(sencount=Count('sentiment'))
    return Response({"genderCount" : gendercount})

@api_view(['GET'])
def service_chart(request):
    servicecount = SentimentPost.objects.values('service', 'sentiment').annotate(sencount=Count('sentiment'))
    return Response({"serviceCount": servicecount})

# class BlogPostListCreate(generics.ListCreateAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer

#     def delete(self, request, *args, **kwargs):
#         BlogPost.objects.all().delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
# class BlogPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer
#     lookup_field = "pk"

# class BlogPostList(APIView):
#     def get(self, request, format=None):
#         title = request.query_params.get("title", "")

#         if title:
#             blog_posts = BlogPost.objects.filter(title__icontains=title)
#         else:
#             blog_posts = BlogPost.objects.all()

#         serializer = BlogPostSerializer(blog_posts, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
