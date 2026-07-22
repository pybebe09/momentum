from rest_framework import viewsets
from config.mixins import OwnerModelViewSetMixin
from .models import TaskItem
from .serializers import TaskItemSerializer

class TaskItemViewSet(OwnerModelViewSetMixin, viewsets.ModelViewSet):
    queryset = TaskItem.objects.all()
    serializer_class = TaskItemSerializer
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['due_date', 'priority', 'created_at', 'estimated_minutes']
    ordering = ['due_date']
