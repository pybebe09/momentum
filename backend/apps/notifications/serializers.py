from rest_framework import serializers
from .models import NotificationItem

class NotificationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationItem
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
