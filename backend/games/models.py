from django.db import models
from accounts.models import ChildProfile


class Game(models.Model):
    GAME_TYPES = [
        ('puzzle', 'Puzzle Game'),
        ('tower', 'Tower/Ring Game'),
        ('emotion', 'Emotion Recognition'),
        ('voice', 'Voice Controlled'),
        ('eye_tracking', 'Eye Tracking'),
    ]
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    name = models.CharField(max_length=200)
    name_urdu = models.CharField(max_length=200, blank=True)
    game_type = models.CharField(max_length=30, choices=GAME_TYPES)
    description = models.TextField(blank=True)
    description_urdu = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    config = models.JSONField(default=dict, help_text='Game-specific configuration')
    thumbnail = models.ImageField(upload_to='games/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.game_type})"


class GameSession(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='game_sessions')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='sessions')
    score = models.IntegerField(default=0)
    max_score = models.IntegerField(default=100)
    duration_seconds = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    data = models.JSONField(default=dict, help_text='Session-specific data like moves, accuracy')
    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-played_at']

    def __str__(self):
        return f"{self.child.name} - {self.game.name} ({self.score})"


class Reward(models.Model):
    REWARD_TYPES = [
        ('star', 'Star'),
        ('badge', 'Badge'),
        ('trophy', 'Trophy'),
        ('sticker', 'Sticker'),
    ]
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='rewards')
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    title = models.CharField(max_length=100)
    title_urdu = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=200, blank=True)
    icon = models.CharField(max_length=50, default='star')
    earned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.child.name} - {self.title}"
