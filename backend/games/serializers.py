from rest_framework import serializers
from .models import Game, GameSession, Reward


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'name', 'name_urdu', 'game_type', 'description',
                  'description_urdu', 'difficulty', 'config', 'thumbnail',
                  'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class GameSessionSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)
    game_name = serializers.CharField(source='game.name', read_only=True)

    class Meta:
        model = GameSession
        fields = ['id', 'child', 'child_name', 'game', 'game_name', 'score',
                  'max_score', 'duration_seconds', 'completed', 'data',
                  'played_at']
        read_only_fields = ['id', 'played_at']


class RewardSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)

    class Meta:
        model = Reward
        fields = ['id', 'child', 'child_name', 'reward_type', 'title',
                  'title_urdu', 'description', 'icon', 'earned_at']
        read_only_fields = ['id', 'earned_at']
