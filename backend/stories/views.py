from rest_framework import viewsets, permissions

from stories.serializers import (
    StoryCategorySerializer,
    StorySerializer,
    StoryProgressSerializer,
)
from stories.models import StoryCategory, Story, StoryProgress


class StoryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """List story categories."""

    queryset = StoryCategory.objects.all()
    serializer_class = StoryCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve stories."""

    queryset = Story.objects.filter(is_active=True)
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]


class StoryProgressViewSet(viewsets.ModelViewSet):
    """CRUD for story progress, filtered by child."""

    serializer_class = StoryProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = StoryProgress.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset
