from rest_framework import viewsets, permissions

from games.serializers import GameSerializer, GameSessionSerializer, RewardSerializer
from games.models import Game, GameSession, Reward


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve games."""

    queryset = Game.objects.filter(is_active=True)
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]


class GameSessionViewSet(viewsets.ModelViewSet):
    """CRUD for game sessions, filtered by child."""

    serializer_class = GameSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = GameSession.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset


class RewardViewSet(viewsets.ReadOnlyModelViewSet):
    """List rewards, filtered by child."""

    serializer_class = RewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Reward.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset
