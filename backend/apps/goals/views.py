from rest_framework import viewsets
from config.mixins import OwnerModelViewSetMixin
from .models import GoalItem
from .serializers import GoalItemSerializer

class GoalItemViewSet(OwnerModelViewSetMixin, viewsets.ModelViewSet):
    queryset = GoalItem.objects.all()
    serializer_class = GoalItemSerializer
    filterset_fields = ['status', 'category']
    search_fields = ['title', 'description', 'category', 'target_metric']
    ordering_fields = ['created_at', 'current_progress', 'deadline']
    ordering = ['-created_at']
