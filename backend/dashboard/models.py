from django.db import models
from accounts.models import ChildProfile, User


class ActivityLog(models.Model):
    ACTIVITY_TYPES = [
        ('lesson', 'Lesson'),
        ('game', 'Game'),
        ('story', 'Story'),
        ('login', 'Login'),
    ]
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='activity_logs')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    activity_id = models.IntegerField(null=True, blank=True)
    title = models.CharField(max_length=200)
    score = models.IntegerField(null=True, blank=True)
    duration_seconds = models.IntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.child.name} - {self.activity_type}: {self.title}"


class BehavioralNote(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('calm', 'Calm'),
        ('anxious', 'Anxious'),
        ('frustrated', 'Frustrated'),
        ('upset', 'Upset'),
    ]
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='behavioral_notes')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, blank=True)
    note = models.TextField()
    session_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-session_date']

    def __str__(self):
        return f"{self.child.name} - {self.session_date}"


class SkillAssessment(models.Model):
    SKILL_AREAS = [
        ('communication', 'Communication'),
        ('social', 'Social Skills'),
        ('emotional', 'Emotional Regulation'),
        ('cognitive', 'Cognitive Skills'),
        ('motor', 'Motor Skills'),
    ]
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='skill_assessments')
    skill_area = models.CharField(max_length=30, choices=SKILL_AREAS)
    score = models.IntegerField(default=0, help_text='Score out of 100')
    assessed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    assessed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-assessed_at']

    def __str__(self):
        return f"{self.child.name} - {self.skill_area}: {self.score}"
