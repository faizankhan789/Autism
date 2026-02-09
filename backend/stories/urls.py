from django.urls import path, include
from rest_framework.routers import DefaultRouter

from stories.views import StoryCategoryViewSet, StoryViewSet, StoryProgressViewSet

router = DefaultRouter()
router.register(r"categories", StoryCategoryViewSet, basename="story-category")
router.register(r"stories", StoryViewSet, basename="story")
router.register(r"progress", StoryProgressViewSet, basename="story-progress")

urlpatterns = [
    path("", include(router.urls)),
]
