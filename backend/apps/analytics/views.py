from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

class SystemTelemetryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Get Complete Performance Analytics Telemetry", responses={200: dict})
    def get(self, request):
        return Response({
            'overview': {
                'totalFocusHours': 42.5,
                'totalStudyHours': 28.0,
                'tasksCompleted': 54,
                'currentStreakDays': 14,
                'momentumScore': 94,
            },
            'dailyData': [
                {'day': 'Mon', 'focusHours': 6.2, 'studyHours': 4.0, 'tasksDone': 8, 'completionRate': 88},
                {'day': 'Tue', 'focusHours': 7.5, 'studyHours': 5.2, 'tasksDone': 11, 'completionRate': 94},
                {'day': 'Wed', 'focusHours': 8.0, 'studyHours': 6.0, 'tasksDone': 14, 'completionRate': 97},
                {'day': 'Thu', 'focusHours': 5.8, 'studyHours': 3.5, 'tasksDone': 7, 'completionRate': 82},
                {'day': 'Fri', 'focusHours': 7.1, 'studyHours': 4.8, 'tasksDone': 10, 'completionRate': 91},
                {'day': 'Sat', 'focusHours': 4.0, 'studyHours': 2.5, 'tasksDone': 5, 'completionRate': 85},
                {'day': 'Sun', 'focusHours': 3.5, 'studyHours': 2.0, 'tasksDone': 4, 'completionRate': 90},
            ],
            'weeklyData': [
                {'week': 'W1', 'completedTasks': 38, 'focusHours': 32.0, 'studyHours': 20.0},
                {'week': 'W2', 'completedTasks': 44, 'focusHours': 36.5, 'studyHours': 24.0},
                {'week': 'W3', 'completedTasks': 51, 'focusHours': 40.0, 'studyHours': 26.5},
                {'week': 'W4', 'completedTasks': 54, 'focusHours': 42.5, 'studyHours': 28.0},
            ],
            'monthlyData': [
                {'month': 'Jan', 'tasks': 120, 'focusHours': 110, 'studyHours': 80},
                {'month': 'Feb', 'tasks': 145, 'focusHours': 130, 'studyHours': 95},
                {'month': 'Mar', 'tasks': 160, 'focusHours': 150, 'studyHours': 110},
                {'month': 'Apr', 'tasks': 175, 'focusHours': 165, 'studyHours': 120},
                {'month': 'May', 'tasks': 190, 'focusHours': 180, 'studyHours': 135},
                {'month': 'Jun', 'tasks': 210, 'focusHours': 195, 'studyHours': 150},
            ],
            'taskStatusDistribution': [
                {'name': 'Completed', 'value': 54, 'color': '#00ff9d'},
                {'name': 'In Progress', 'value': 28, 'color': '#00f0ff'},
                {'name': 'To Do', 'value': 18, 'color': '#f59e0b'},
                {'name': 'Blocked', 'value': 5, 'color': '#f43f5e'},
            ],
            'goalProgressDistribution': [
                {'category': 'Japan', 'progress': 65},
                {'category': 'Cybersecurity', 'progress': 88},
                {'category': 'IELTS', 'progress': 80},
                {'category': 'SAT', 'progress': 45},
            ],
        })
