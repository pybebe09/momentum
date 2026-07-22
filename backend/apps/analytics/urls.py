from django.urls import path
from .views import SystemTelemetryView

urlpatterns = [
    path('telemetry/', SystemTelemetryView.as_view(), name='telemetry'),
]
