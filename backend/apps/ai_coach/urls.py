from django.urls import path
from .views import AICoachDailyView, AICoachWeeklyView, AICoachQueryView

urlpatterns = [
    path('daily/', AICoachDailyView.as_view(), name='ai_coach_daily'),
    path('weekly/', AICoachWeeklyView.as_view(), name='ai_coach_weekly'),
    path('query/', AICoachQueryView.as_view(), name='ai_coach_query'),
]
