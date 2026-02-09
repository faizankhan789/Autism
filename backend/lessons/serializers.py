from rest_framework import serializers
from .models import LessonCategory, Lesson, LessonProgress, Quiz


class LessonCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonCategory
        fields = ['id', 'name', 'name_urdu', 'description', 'icon', 'order']
        read_only_fields = ['id']


class LessonSerializer(serializers.ModelSerializer):
    category_detail = LessonCategorySerializer(source='category',
                                               read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'category', 'category_detail', 'title', 'title_urdu',
                  'description', 'description_urdu', 'difficulty', 'content',
                  'thumbnail', 'duration_minutes', 'order', 'is_active',
                  'created_at']
        read_only_fields = ['id', 'created_at']


class LessonProgressSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = LessonProgress
        fields = ['id', 'child', 'child_name', 'lesson', 'lesson_title',
                  'completed', 'score', 'time_spent_seconds', 'attempts',
                  'completed_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'lesson', 'question', 'question_urdu', 'options',
                  'correct_answer', 'image', 'order']
        read_only_fields = ['id']
