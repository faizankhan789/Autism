from django.urls import path, include
from rest_framework.routers import DefaultRouter

from games.views import GameViewSet, GameSessionViewSet, RewardViewSet

router = DefaultRouter()
router.register(r"games", GameViewSet, basename="game")
router.register(r"sessions", GameSessionViewSet, basename="game-session")
router.register(r"rewards", RewardViewSet, basename="reward")

urlpatterns = [
    path("", include(router.urls)),
]
