from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import (
    RegisterView,
    UserViewSet,
    ChildProfileViewSet,
    TherapistProfileViewSet,
)

router = DefaultRouter()
router.register(r"children", ChildProfileViewSet, basename="child-profile")
router.register(r"therapists", TherapistProfileViewSet, basename="therapist-profile")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "me/",
        UserViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update"}),
        name="user-me",
    ),
    path("", include(router.urls)),
]
