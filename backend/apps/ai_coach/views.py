from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema
from apps.tasks.models import TaskItem
from apps.goals.models import GoalItem
from apps.focus.models import FocusSession
from .providers import get_ai_provider

class AICoachDailyView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Get Daily AI Insight Advisory Card", responses={200: dict})
    def get(self, request):
        provider = get_ai_provider()
        user_tasks = TaskItem.objects.filter(user=request.user)
        user_goals = GoalItem.objects.filter(user=request.user)
        user_focus = FocusSession.objects.filter(user=request.user)

        context = {
            'user': request.user.username,
            'tasks_count': user_tasks.count(),
            'completed_count': user_tasks.filter(status='COMPLETED').count(),
            'goals_count': user_goals.count(),
            'focus_hours': round(sum(f.duration_minutes for f in user_focus) / 60.0, 1),
        }
        insight = provider.generate_daily_insight(context)
        return Response(insight)

class AICoachWeeklyView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Get Weekly Performance Audit Report", responses={200: dict})
    def get(self, request):
        provider = get_ai_provider()
        user_tasks = TaskItem.objects.filter(user=request.user)
        user_goals = GoalItem.objects.filter(user=request.user)

        context = {
            'user': request.user.username,
            'tasks_count': user_tasks.count(),
            'completed_goals_count': user_goals.filter(status='COMPLETED').count(),
        }
        report = provider.generate_weekly_report(context)
        return Response(report)

class AICoachQueryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Query AI Performance Coach", responses={200: dict})
    def post(self, request):
        query = request.data.get('query', '')
        if not query or not query.strip():
            return Response({'error': 'Query string is required.'}, status=status.HTTP_400_BAD_REQUEST)

        provider = get_ai_provider()
        answer = provider.answer_query(query.strip(), {'user': request.user.username})
        return Response({'query': query, 'answer': answer})
