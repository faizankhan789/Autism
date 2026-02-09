from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dashboard.views import (
    ActivityLogViewSet,
    BehavioralNoteViewSet,
    SkillAssessmentViewSet,
    DashboardSummaryView,
)

router = DefaultRouter()
router.register(r"activity-logs", ActivityLogViewSet, basename="activity-log")
router.register(r"behavioral-notes", BehavioralNoteViewSet, basename="behavioral-note")
router.register(r"skill-assessments", SkillAssessmentViewSet, basename="skill-assessment")

urlpatterns = [
    path("summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("", include(router.urls)),
]
