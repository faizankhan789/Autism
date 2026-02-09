from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChildProfile, TherapistProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'role', 'phone', 'avatar']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm',
                  'first_name', 'last_name', 'role', 'phone']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginResponseSerializer(serializers.ModelSerializer):
    """Read-only serializer returned after successful login."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'role', 'phone', 'avatar']
        read_only_fields = fields


class ChildProfileSerializer(serializers.ModelSerializer):
    parent_username = serializers.CharField(source='parent.username',
                                            read_only=True)

    class Meta:
        model = ChildProfile
        fields = ['id', 'parent', 'parent_username', 'name', 'date_of_birth',
                  'severity', 'preferences', 'avatar_image', 'notes',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_children = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ChildProfile.objects.all(), required=False)

    class Meta:
        model = TherapistProfile
        fields = ['id', 'user', 'specialization', 'license_number',
                  'assigned_children']
        read_only_fields = ['id']
