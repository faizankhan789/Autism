from rest_framework import serializers
from .models import ActivityLog, BehavioralNote, SkillAssessment


class ActivityLogSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'child', 'child_name', 'activity_type',
                  'activity_id', 'title', 'score', 'duration_seconds',
                  'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class BehavioralNoteSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)
    author_username = serializers.CharField(source='author.username',
                                            read_only=True)

    class Meta:
        model = BehavioralNote
        fields = ['id', 'child', 'child_name', 'author', 'author_username',
                  'mood', 'note', 'session_date', 'created_at']
        read_only_fields = ['id', 'created_at']


class SkillAssessmentSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)
    assessed_by_username = serializers.CharField(
        source='assessed_by.username', read_only=True, default=None)

    class Meta:
        model = SkillAssessment
        fields = ['id', 'child', 'child_name', 'skill_area', 'score',
                  'assessed_by', 'assessed_by_username', 'notes',
                  'assessed_at']
        read_only_fields = ['id', 'assessed_at']
