from rest_framework import serializers
from .models import GoalItem

class GoalItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalItem
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Goal title cannot be empty or whitespace.")
        return value.strip()

    def validate_target_value(self, value):
        if value <= 0:
            raise serializers.ValidationError("Target value must be greater than zero.")
        return value
