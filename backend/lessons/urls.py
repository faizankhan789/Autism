from django.urls import path, include
from rest_framework.routers import DefaultRouter

from lessons.views import (
    LessonCategoryViewSet,
    LessonViewSet,
    LessonProgressViewSet,
    QuizViewSet,
)

router = DefaultRouter()
router.register(r"categories", LessonCategoryViewSet, basename="lesson-category")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"progress", LessonProgressViewSet, basename="lesson-progress")
router.register(r"quizzes", QuizViewSet, basename="quiz")

urlpatterns = [
    path("", include(router.urls)),
]
