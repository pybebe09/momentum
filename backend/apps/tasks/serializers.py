from rest_framework import serializers
from .models import TaskItem

class TaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Task title cannot be empty or whitespace.")
        return value.strip()
