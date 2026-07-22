from rest_framework import serializers
from .models import FocusSession

class FocusSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FocusSession
        fields = '__all__'
        read_only_fields = ('user', 'completed_at')

    def validate_task(self, value):
        """
        Security Validation: Prevent IDOR (Insecure Direct Object Reference).
        Ensure the linked task belongs to the requesting operator.
        """
        request = self.context.get('request')
        if value and request and hasattr(request, 'user'):
            if value.user != request.user:
                raise serializers.ValidationError("Linked task does not belong to the current operator.")
        return value
