from django.db import models
from accounts.models import ChildProfile


class StoryCategory(models.Model):
    name = models.CharField(max_length=100)
    name_urdu = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='book-open')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Story Categories'

    def __str__(self):
        return self.name


class Story(models.Model):
    category = models.ForeignKey(StoryCategory, on_delete=models.CASCADE, related_name='stories')
    title = models.CharField(max_length=200)
    title_urdu = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    description_urdu = models.TextField(blank=True)
    scenes = models.JSONField(default=list, help_text='Array of scene objects with text, image, audio')
    thumbnail = models.ImageField(upload_to='stories/', blank=True, null=True)
    is_custom = models.BooleanField(default=False)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Stories'

    def __str__(self):
        return self.title


class StoryProgress(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='story_progress')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='progress')
    current_scene = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['child', 'story']

    def __str__(self):
        return f"{self.child.name} - {self.story.title}"
