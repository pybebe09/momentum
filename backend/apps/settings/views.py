from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from .models import UserSettings
from .serializers import UserSettingsSerializer

class UserSettingsDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Get User Settings", responses={200: UserSettingsSerializer})
    def get(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    @extend_schema(summary="Update User Settings", request=UserSettingsSerializer, responses={200: UserSettingsSerializer})
    def patch(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
