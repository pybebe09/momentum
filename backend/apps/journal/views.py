from rest_framework import viewsets
from config.mixins import OwnerModelViewSetMixin
from .models import JournalEntry
from .serializers import JournalEntrySerializer

class JournalEntryViewSet(OwnerModelViewSetMixin, viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    filterset_fields = ['mood', 'entry_date']
    search_fields = ['title', 'content', 'question_1', 'question_2', 'question_3']
    ordering_fields = ['entry_date', 'created_at', 'energy_level']
    ordering = ['-entry_date']
