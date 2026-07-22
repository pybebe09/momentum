from rest_framework import viewsets
from config.mixins import OwnerModelViewSetMixin
from .models import FocusSession
from .serializers import FocusSessionSerializer

class FocusSessionViewSet(OwnerModelViewSetMixin, viewsets.ModelViewSet):
    queryset = FocusSession.objects.all()
    serializer_class = FocusSessionSerializer
    select_related_fields = ['user', 'task']
    filterset_fields = ['session_type']
    search_fields = ['title']
    ordering_fields = ['completed_at', 'duration_minutes', 'productivity_rating']
    ordering = ['-completed_at']
