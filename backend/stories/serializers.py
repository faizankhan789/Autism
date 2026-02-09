from rest_framework import serializers
from .models import StoryCategory, Story, StoryProgress


class StoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryCategory
        fields = ['id', 'name', 'name_urdu', 'description', 'icon', 'order']
        read_only_fields = ['id']


class StorySerializer(serializers.ModelSerializer):
    category_detail = StoryCategorySerializer(source='category',
                                              read_only=True)
    created_by_username = serializers.CharField(
        source='created_by.username', read_only=True, default=None)

    class Meta:
        model = Story
        fields = ['id', 'category', 'category_detail', 'title', 'title_urdu',
                  'description', 'description_urdu', 'scenes', 'thumbnail',
                  'is_custom', 'created_by', 'created_by_username',
                  'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class StoryProgressSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)
    story_title = serializers.CharField(source='story.title', read_only=True)

    class Meta:
        model = StoryProgress
        fields = ['id', 'child', 'child_name', 'story', 'story_title',
                  'current_scene', 'completed', 'completed_at', 'created_at']
        read_only_fields = ['id', 'created_at']
