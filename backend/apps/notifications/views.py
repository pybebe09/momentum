from rest_framework import viewsets
from config.mixins import OwnerModelViewSetMixin
from .models import NotificationItem
from .serializers import NotificationItemSerializer

class NotificationItemViewSet(OwnerModelViewSetMixin, viewsets.ModelViewSet):
    queryset = NotificationItem.objects.all()
    serializer_class = NotificationItemSerializer
    filterset_fields = ['is_read', 'notification_type']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
