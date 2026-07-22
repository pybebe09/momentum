from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.db.models import Sum, Avg
from django.utils import timezone
from datetime import timedelta, date
from apps.focus.models import FocusSession
from apps.tasks.models import TaskItem
from apps.goals.models import GoalItem

class SystemTelemetryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Get Complete Performance Analytics Telemetry", responses={200: dict})
    def get(self, request):
        user = request.user

        # 1. Focus session calculations
        focus_sessions = FocusSession.objects.filter(user=user)
        focus_minutes = focus_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
        total_focus_hours = round(focus_minutes / 60.0, 1)

        study_minutes = focus_sessions.filter(session_type='DEEP_WORK').aggregate(total=Sum('duration_minutes'))['total'] or 0
        total_study_hours = round(study_minutes / 60.0, 1)
        if total_study_hours == 0 and total_focus_hours > 0:
            total_study_hours = round(total_focus_hours * 0.65, 1)

        # 2. Tasks calculations
        tasks = TaskItem.objects.filter(user=user)
        tasks_completed = tasks.filter(status='COMPLETED').count()
        blocked_tasks_count = tasks.filter(status='BLOCKED').count()
        total_tasks = tasks.count()

        # 3. Streak calculation
        active_dates = set()
        for s in focus_sessions:
            active_dates.add(timezone.localdate(s.completed_at))
        for t in tasks.filter(status='COMPLETED'):
            active_dates.add(timezone.localdate(t.updated_at))

        sorted_dates = sorted(active_dates, reverse=True)
        streak = 0
        if sorted_dates:
            today = timezone.localdate()
            yesterday = today - timedelta(days=1)
            if sorted_dates[0] in (today, yesterday):
                streak = 1
                current_date = sorted_dates[0]
                for next_date in sorted_dates[1:]:
                    diff = (current_date - next_date).days
                    if diff == 1:
                        streak += 1
                        current_date = next_date
                    elif diff > 1:
                        break

        # 4. Momentum Score calculation
        if total_tasks == 0 and focus_sessions.count() == 0:
            momentum_score = 0
        else:
            task_factor = (tasks_completed / total_tasks * 100) if total_tasks > 0 else 100
            
            last_week = timezone.now() - timedelta(days=7)
            recent_focus_minutes = focus_sessions.filter(completed_at__gte=last_week).aggregate(total=Sum('duration_minutes'))['total'] or 0
            recent_focus_hours = recent_focus_minutes / 60.0
            focus_factor = min(100, (recent_focus_hours / 10.0) * 100)
            
            momentum_score = round((task_factor + focus_factor) / 2)
            momentum_score = max(10, min(100, momentum_score))

        # 5. Daily trend data (last 7 days)
        daily_data = []
        for i in range(6, -1, -1):
            date_val = timezone.localdate() - timedelta(days=i)
            day_name = date_val.strftime('%a')
            
            day_sessions = focus_sessions.filter(completed_at__date=date_val)
            day_focus_minutes = day_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
            day_focus_hours = round(day_focus_minutes / 60.0, 1)
            
            day_study_minutes = day_sessions.filter(session_type='DEEP_WORK').aggregate(total=Sum('duration_minutes'))['total'] or 0
            day_study_hours = round(day_study_minutes / 60.0, 1)
            
            day_tasks_done = tasks.filter(status='COMPLETED', updated_at__date=date_val).count()
            
            day_completion_rate = 0
            total_tasks_today = tasks.filter(created_at__date__lte=date_val).count()
            if total_tasks_today > 0:
                completed_tasks_today = tasks.filter(status='COMPLETED', created_at__date__lte=date_val).count()
                day_completion_rate = round((completed_tasks_today / total_tasks_today) * 100)
            
            daily_data.append({
                'day': day_name,
                'focusHours': day_focus_hours,
                'studyHours': day_study_hours,
                'tasksDone': day_tasks_done,
                'completionRate': day_completion_rate
            })

        # 6. Weekly trend data (last 4 weeks)
        weekly_data = []
        for w in range(4):
            days_ago_start = (3 - w) * 7
            days_ago_end = days_ago_start + 6
            
            start_date = timezone.localdate() - timedelta(days=days_ago_end)
            end_date = timezone.localdate() - timedelta(days=days_ago_start)
            
            week_sessions = focus_sessions.filter(
                completed_at__date__gte=start_date, 
                completed_at__date__lte=end_date
            )
            week_focus_minutes = week_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
            week_focus_hours = round(week_focus_minutes / 60.0, 1)
            
            week_study_minutes = week_sessions.filter(session_type='DEEP_WORK').aggregate(total=Sum('duration_minutes'))['total'] or 0
            week_study_hours = round(week_study_minutes / 60.0, 1)
            
            week_tasks_done = tasks.filter(
                status='COMPLETED', 
                updated_at__date__gte=start_date, 
                updated_at__date__lte=end_date
            ).count()
            
            weekly_data.append({
                'week': f'W{w+1}',
                'completedTasks': week_tasks_done,
                'focusHours': week_focus_hours,
                'studyHours': week_study_hours
            })

        # 7. Monthly trend data (last 6 months)
        monthly_data = []
        current_date = timezone.localdate()
        for i in range(5, -1, -1):
            month_offset = current_date.month - i
            year = current_date.year
            month = month_offset
            while month <= 0:
                month += 12
                year -= 1
            
            month_name = date(year, month, 1).strftime('%b')
            
            month_sessions = focus_sessions.filter(
                completed_at__year=year,
                completed_at__month=month
            )
            month_focus_minutes = month_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
            month_focus_hours = round(month_focus_minutes / 60.0, 1)
            
            month_study_minutes = month_sessions.filter(session_type='DEEP_WORK').aggregate(total=Sum('duration_minutes'))['total'] or 0
            month_study_hours = round(month_study_minutes / 60.0, 1)
            
            month_tasks = tasks.filter(
                status='COMPLETED',
                updated_at__year=year,
                updated_at__month=month
            ).count()
            
            monthly_data.append({
                'month': month_name,
                'tasks': month_tasks,
                'focusHours': month_focus_hours,
                'studyHours': month_study_hours
            })

        # 8. Task status distribution
        completed = tasks.filter(status='COMPLETED').count()
        in_progress = tasks.filter(status='IN_PROGRESS').count()
        todo = tasks.filter(status='TODO').count()
        blocked = tasks.filter(status='BLOCKED').count()
        
        task_status_distribution = [
            {'name': 'Completed', 'value': completed, 'color': '#00ff9d'},
            {'name': 'In Progress', 'value': in_progress, 'color': '#00f0ff'},
            {'name': 'To Do', 'value': todo, 'color': '#f59e0b'},
            {'name': 'Blocked', 'value': blocked, 'color': '#f43f5e'},
        ]

        # 9. Goal progress distribution
        goals_by_category = GoalItem.objects.filter(user=user).values('category').annotate(avg_progress=Avg('current_progress'))
        goal_progress_distribution = []
        for g in goals_by_category:
            goal_progress_distribution.append({
                'category': g['category'],
                'progress': round(g['avg_progress'] or 0.0)
            })
        
        if not goal_progress_distribution:
            goal_progress_distribution = [
                {'category': 'Japan', 'progress': 0},
                {'category': 'Cybersecurity', 'progress': 0},
                {'category': 'IELTS', 'progress': 0},
                {'category': 'SAT', 'progress': 0},
            ]

        return Response({
            'overview': {
                'totalFocusHours': total_focus_hours,
                'totalStudyHours': total_study_hours,
                'tasksCompleted': tasks_completed,
                'currentStreakDays': streak,
                'momentumScore': momentum_score,
            },
            'dailyData': daily_data,
            'weeklyData': weekly_data,
            'monthlyData': monthly_data,
            'taskStatusDistribution': task_status_distribution,
            'goalProgressDistribution': goal_progress_distribution,
            'activeDates': [d.isoformat() for d in sorted_dates],
        })
