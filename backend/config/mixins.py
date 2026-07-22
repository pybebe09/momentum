from rest_framework.permissions import IsAuthenticated
from config.permissions import IsOwnerPermission

class OwnerModelViewSetMixin:
    """
    DRY Mixin providing owner-scoped QuerySet filtering, auto-saving user ownership,
    and owner permission checks across ViewSets.
    """
    permission_classes = [IsAuthenticated, IsOwnerPermission]
    select_related_fields = ['user']

    def get_queryset(self):
        qs = super().get_queryset()
        if hasattr(self.serializer_class.Meta.model, 'user'):
            if self.select_related_fields:
                qs = qs.select_related(*self.select_related_fields)
            return qs.filter(user=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
