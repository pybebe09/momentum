from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

def health_check(request):
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    path('api/health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),

    # OpenAPI Schema & Interactive Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Authentication API endpoints (JWT)
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('apps.authentication.urls')),

    # Feature API endpoints (Version 1)
    path('api/v1/tasks/', include('apps.tasks.urls')),
    path('api/v1/goals/', include('apps.goals.urls')),
    path('api/v1/focus/', include('apps.focus.urls')),
    path('api/v1/journal/', include('apps.journal.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/ai-coach/', include('apps.ai_coach.urls')),
    path('api/v1/settings/', include('apps.settings.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),

    # Direct Alias API endpoints (for backward compatibility)
    path('api/tasks/', include('apps.tasks.urls')),
    path('api/goals/', include('apps.goals.urls')),
    path('api/focus/', include('apps.focus.urls')),
    path('api/journal/', include('apps.journal.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/ai-coach/', include('apps.ai_coach.urls')),
    path('api/settings/', include('apps.settings.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]
