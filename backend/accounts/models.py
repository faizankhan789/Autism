from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('parent', 'Parent'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='parent')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class ChildProfile(models.Model):
    SEVERITY_CHOICES = [
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='children')
    name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='mild')
    preferences = models.JSONField(default=dict, blank=True,
        help_text='Sensory preferences: color theme, sound level, animation speed')
    avatar_image = models.ImageField(upload_to='child_avatars/', blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (Child of {self.parent.username})"


class TherapistProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='therapist_profile')
    specialization = models.CharField(max_length=200, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    assigned_children = models.ManyToManyField(ChildProfile, blank=True, related_name='therapists')

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"
