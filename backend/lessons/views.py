from rest_framework import viewsets, permissions

from lessons.serializers import (
    LessonCategorySerializer,
    LessonSerializer,
    LessonProgressSerializer,
    QuizSerializer,
)
from lessons.models import LessonCategory, Lesson, LessonProgress, Quiz


class LessonCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """List lesson categories."""

    queryset = LessonCategory.objects.all()
    serializer_class = LessonCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve lessons, optionally filtered by category."""

    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Lesson.objects.filter(is_active=True)
        category_id = self.request.query_params.get("category")
        if category_id is not None:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class LessonProgressViewSet(viewsets.ModelViewSet):
    """CRUD for lesson progress, filtered by child."""

    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LessonProgress.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """List quizzes, optionally filtered by lesson."""

    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Quiz.objects.all()
        lesson_id = self.request.query_params.get("lesson")
        if lesson_id is not None:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset
