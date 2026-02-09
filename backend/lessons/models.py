from django.db import models
from accounts.models import ChildProfile


class LessonCategory(models.Model):
    name = models.CharField(max_length=100)
    name_urdu = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='book')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Lesson Categories'

    def __str__(self):
        return self.name


class Lesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    category = models.ForeignKey(LessonCategory, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    title_urdu = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    description_urdu = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    content = models.JSONField(default=list, help_text='Steps with text, images, animations')
    thumbnail = models.ImageField(upload_to='lessons/', blank=True, null=True)
    duration_minutes = models.IntegerField(default=5)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'order']

    def __str__(self):
        return self.title


class LessonProgress(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    time_spent_seconds = models.IntegerField(default=0)
    attempts = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['child', 'lesson']

    def __str__(self):
        return f"{self.child.name} - {self.lesson.title}"


class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    question = models.TextField()
    question_urdu = models.TextField(blank=True)
    options = models.JSONField(default=list)
    correct_answer = models.IntegerField(default=0)
    image = models.ImageField(upload_to='quizzes/', blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return f"Quiz: {self.question[:50]}"
