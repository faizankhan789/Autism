from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import User, ChildProfile, TherapistProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "role", "is_staff"]
    list_filter = ["role", "is_staff", "is_active"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Extra Fields", {"fields": ("role", "phone", "avatar")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Extra Fields", {"fields": ("role", "phone")}),
    )


@admin.register(ChildProfile)
class ChildProfileAdmin(admin.ModelAdmin):
    list_display = ["name", "parent", "severity", "date_of_birth", "created_at"]
    list_filter = ["severity"]
    search_fields = ["name", "parent__username"]


@admin.register(TherapistProfile)
class TherapistProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "specialization", "license_number"]
    search_fields = ["user__username", "user__first_name", "user__last_name", "specialization"]
