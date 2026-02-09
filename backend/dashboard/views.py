from django.db.models import Sum, Count, Avg
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from dashboard.serializers import (
    ActivityLogSerializer,
    BehavioralNoteSerializer,
    SkillAssessmentSerializer,
)
from dashboard.models import ActivityLog, BehavioralNote, SkillAssessment
from accounts.models import ChildProfile
from lessons.models import LessonProgress
from games.models import GameSession, Reward


class ActivityLogViewSet(viewsets.ModelViewSet):
    """List and create activity logs, filtered by child."""

    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        queryset = ActivityLog.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset


class BehavioralNoteViewSet(viewsets.ModelViewSet):
    """CRUD for behavioral notes."""

    serializer_class = BehavioralNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = BehavioralNote.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class SkillAssessmentViewSet(viewsets.ModelViewSet):
    """List and create skill assessments."""

    serializer_class = SkillAssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        queryset = SkillAssessment.objects.all()
        child_id = self.request.query_params.get("child")
        if child_id is not None:
            queryset = queryset.filter(child_id=child_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(assessed_by=self.request.user)


class DashboardSummaryView(APIView):
    """Return aggregated stats for a specific child."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        child_id = request.query_params.get("child")
        if not child_id:
            return Response(
                {"detail": "Query parameter 'child' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            child = ChildProfile.objects.get(pk=child_id)
        except ChildProfile.DoesNotExist:
            return Response(
                {"detail": "Child not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Lesson stats
        lesson_progress = LessonProgress.objects.filter(child=child)
        lessons_completed = lesson_progress.filter(completed=True).count()
        lessons_total = lesson_progress.count()
        lesson_avg_score = lesson_progress.aggregate(avg=Avg("score"))["avg"] or 0

        # Game stats
        game_sessions = GameSession.objects.filter(child=child)
        games_played = game_sessions.count()
        games_completed = game_sessions.filter(completed=True).count()
        game_avg_score = game_sessions.aggregate(avg=Avg("score"))["avg"] or 0
        total_game_time = game_sessions.aggregate(total=Sum("duration_seconds"))["total"] or 0

        # Rewards
        rewards_count = Reward.objects.filter(child=child).count()

        # Activity summary
        activity_counts = (
            ActivityLog.objects.filter(child=child)
            .values("activity_type")
            .annotate(count=Count("id"))
        )
        activity_summary = {item["activity_type"]: item["count"] for item in activity_counts}
        total_activity_time = (
            ActivityLog.objects.filter(child=child).aggregate(
                total=Sum("duration_seconds")
            )["total"]
            or 0
        )

        # Latest skill assessments (most recent per skill area)
        latest_assessments = []
        for area_code, area_label in SkillAssessment.SKILL_AREAS:
            assessment = (
                SkillAssessment.objects.filter(child=child, skill_area=area_code)
                .order_by("-assessed_at")
                .first()
            )
            if assessment:
                latest_assessments.append(
                    {
                        "skill_area": area_code,
                        "skill_area_label": area_label,
                        "score": assessment.score,
                        "assessed_at": assessment.assessed_at,
                    }
                )

        return Response(
            {
                "child_id": child.id,
                "child_name": child.name,
                "lessons": {
                    "completed": lessons_completed,
                    "total": lessons_total,
                    "average_score": round(lesson_avg_score, 1),
                },
                "games": {
                    "played": games_played,
                    "completed": games_completed,
                    "average_score": round(game_avg_score, 1),
                    "total_time_seconds": total_game_time,
                },
                "rewards_earned": rewards_count,
                "activity_summary": activity_summary,
                "total_activity_time_seconds": total_activity_time,
                "skill_assessments": latest_assessments,
            }
        )
