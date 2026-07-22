from django.urls import path
from .views import UserSettingsDetailView

urlpatterns = [
    path('', UserSettingsDetailView.as_view(), name='user_settings'),
]
