from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.authentication.models import UserProfile
from apps.tasks.models import TaskItem
from apps.goals.models import GoalItem
from apps.focus.models import FocusSession
from apps.journal.models import JournalEntry
from apps.analytics.models import AnalyticsTelemetry
from apps.settings.models import UserSettings
from apps.notifications.models import NotificationItem
import datetime
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds database with realistic operator tasks, goals, focus sessions, journal logs, and telemetry.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding process..."))

        # Create or update default operator user
        user, created = User.objects.get_or_create(
            username='Operator',
            defaults={
                'email': 'operator@momentum.cyber',
                'first_name': 'Alex',
                'last_name': 'Vance',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created default user: Operator / password123"))
        else:
            user.set_password('password123')
            user.save()

        # Seed UserProfile
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'auth_provider': 'EMAIL',
                'is_email_verified': True,
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
            }
        )

        # Seed UserSettings
        UserSettings.objects.get_or_create(
            user=user,
            defaults={
                'theme': 'dark',
                'language': 'en-US',
                'timezone': 'UTC',
                'email_digest': True,
                'task_reminders': True,
                'focus_alarms': True,
                'private_profile': True,
                'share_telemetry': True
            }
        )

        # Seed Tasks
        tasks_data = [
            {
                'title': 'Deploy Zero-Trust Authentication Protocol',
                'description': 'Implement JWT refresh rotation, sliding expiration, and biometric webauthn challenge.',
                'status': 'IN_PROGRESS',
                'priority': 'CRITICAL',
                'category': 'Security Architecture',
                'estimated_minutes': 180,
                'due_date': timezone.now().date() + datetime.timedelta(days=2)
            },
            {
                'title': 'Audit System Telemetry Metrics',
                'description': 'Optimize TanStack Query cache invalidation strategy for low-latency nodes.',
                'status': 'COMPLETED',
                'priority': 'HIGH',
                'category': 'Telemetry',
                'estimated_minutes': 90,
                'due_date': timezone.now().date()
            },
            {
                'title': 'Refactor Glassmorphism Design Tokens',
                'description': 'Update Tailwind neon blue & emerald glowing state tokens for dark/light themes.',
                'status': 'IN_PROGRESS',
                'priority': 'MEDIUM',
                'category': 'UI/UX Design',
                'estimated_minutes': 120,
                'due_date': timezone.now().date() + datetime.timedelta(days=4)
            },
            {
                'title': 'Configure PostgreSQL Connection Pool',
                'description': 'Tune Django DB settings with persistent connections (CONN_MAX_AGE) and index optimization.',
                'status': 'TODO',
                'priority': 'HIGH',
                'category': 'Backend Pipeline',
                'estimated_minutes': 150,
                'due_date': timezone.now().date() + datetime.timedelta(days=6)
            },
            {
                'title': 'Automate Daily Focus Session Analytics',
                'description': 'Synthesize Pomodoro interval data into visual performance charts and heatmap matrix.',
                'status': 'TODO',
                'priority': 'LOW',
                'category': 'Analytics',
                'estimated_minutes': 60,
                'due_date': timezone.now().date() + datetime.timedelta(days=8)
            },
            {
                'title': 'JLPT N2 Kanji Drill Review (1,000 Flashcards)',
                'description': 'Review core N2 kanji radicals and complete practice quiz module 4.',
                'status': 'IN_PROGRESS',
                'priority': 'HIGH',
                'category': 'Japan Relocation',
                'estimated_minutes': 45,
                'due_date': timezone.now().date() + datetime.timedelta(days=1)
            },
            {
                'title': 'IELTS Academic Essay Prompt #14',
                'description': 'Write 300-word Task 2 essay on technology and automation in international logistics.',
                'status': 'COMPLETED',
                'priority': 'HIGH',
                'category': 'IELTS',
                'estimated_minutes': 60,
                'due_date': timezone.now().date() - datetime.timedelta(days=1)
            },
            {
                'title': 'SAT Math 800 Drill Set #8',
                'description': 'Complete 30 advanced quadratic and exponential problem sets.',
                'status': 'TODO',
                'priority': 'MEDIUM',
                'category': 'SAT',
                'estimated_minutes': 75,
                'due_date': timezone.now().date() + datetime.timedelta(days=3)
            }
        ]

        created_tasks = []
        for td in tasks_data:
            task, _ = TaskItem.objects.get_or_create(
                user=user,
                title=td['title'],
                defaults=td
            )
            created_tasks.append(task)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(created_tasks)} tasks."))

        # Seed Goals
        goals_data = [
            {
                'title': 'Japan Relocation & JLPT N2 Proficiency',
                'description': 'Master Kanji, grammar, and complete visa documentation for Tokyo tech hub relocation.',
                'target_metric': 'JLPT Modules & Visa Prep',
                'current_progress': 65,
                'target_value': 100,
                'unit': '%',
                'deadline': 'Q4 2026',
                'status': 'ON_TRACK',
                'category': 'Japan',
                'milestones': [
                    {'id': 'm1', 'title': 'Complete N3 Kanji Core (1,000 characters)', 'isCompleted': True},
                    {'id': 'm2', 'title': 'Pass JLPT N2 Practice Examination (85%+ score)', 'isCompleted': True},
                    {'id': 'm3', 'title': 'Submit Technical Specialist Visa Documentation', 'isCompleted': False},
                    {'id': 'm4', 'title': 'Secure Software Engineer Offer in Tokyo', 'isCompleted': False},
                ]
            },
            {
                'title': 'Zero-Trust Cybersecurity Certification',
                'description': 'Achieve CISM & CISSP certifications and zero high-severity vulnerabilities.',
                'target_metric': 'Security Audit Compliance',
                'current_progress': 88,
                'target_value': 100,
                'unit': '%',
                'deadline': 'Q3 2026',
                'status': 'ON_TRACK',
                'category': 'Cybersecurity',
                'milestones': [
                    {'id': 'm1', 'title': 'Implement JWT Refresh Rotation & OAuth 2.0', 'isCompleted': True},
                    {'id': 'm2', 'title': 'Complete Penetration Testing & Vulnerability Audit', 'isCompleted': True},
                    {'id': 'm3', 'title': 'Achieve 100% Security Infrastructure Compliance', 'isCompleted': False},
                ]
            },
            {
                'title': 'IELTS Academic Band 8.5 Certification',
                'description': 'Master Academic Writing Task 1/2 and Speaking fluency for international standards.',
                'target_metric': 'Practice Test Average Band',
                'current_progress': 80,
                'target_value': 100,
                'unit': '%',
                'deadline': 'Q4 2026',
                'status': 'ON_TRACK',
                'category': 'IELTS',
                'milestones': [
                    {'id': 'm1', 'title': 'Write 30 Academic Essay Prompts', 'isCompleted': True},
                    {'id': 'm2', 'title': 'Achieve Band 8.5 in Listening & Reading Practice', 'isCompleted': True},
                    {'id': 'm3', 'title': 'Conduct Mock Speaking Interviews with Native Speakers', 'isCompleted': False},
                ]
            },
            {
                'title': 'SAT Subject Mastery (1550+ Score Target)',
                'description': 'Complete Math 800 drill modules and Advanced Evidence-Based Reading.',
                'target_metric': 'Practice Exam Target Score',
                'current_progress': 45,
                'target_value': 100,
                'unit': '%',
                'deadline': 'Q4 2026',
                'status': 'AT_RISK',
                'category': 'SAT',
                'milestones': [
                    {'id': 'm1', 'title': 'Score 800 on College Board Math Practice 1-5', 'isCompleted': True},
                    {'id': 'm2', 'title': 'Complete 50 Reading Comprehension Passage Drills', 'isCompleted': False},
                    {'id': 'm3', 'title': 'Complete Full-Length Timed Diagnostic Exam', 'isCompleted': False},
                ]
            }
        ]

        for gd in goals_data:
            GoalItem.objects.get_or_create(
                user=user,
                title=gd['title'],
                defaults=gd
            )
        self.stdout.write(self.style.SUCCESS("Seeded goals and milestones."))

        # Seed Focus Sessions
        focus_data = [
            {'title': 'Core Engine Refactoring', 'duration_minutes': 45, 'session_type': 'DEEP_WORK', 'productivity_rating': 5, 'task': created_tasks[0]},
            {'title': 'Security Vulnerability Review', 'duration_minutes': 25, 'session_type': 'POMODORO', 'productivity_rating': 4, 'task': created_tasks[1]},
            {'title': 'System Telemetry Calibration', 'duration_minutes': 25, 'session_type': 'POMODORO', 'productivity_rating': 5, 'task': created_tasks[2]},
        ]

        for fd in focus_data:
            FocusSession.objects.get_or_create(
                user=user,
                title=fd['title'],
                defaults=fd
            )
        self.stdout.write(self.style.SUCCESS("Seeded focus sessions."))

        # Seed Journal Entries
        journal_data = [
            {
                'title': 'Architecture Blueprinting & Design Sync',
                'content': 'Achieved high clarity on full-stack architecture. Merged Apple-minimalism with cybersecurity telemetry. TanStack Query handles remote state effortlessly.',
                'question_1': 'Successfully deployed complete authentication flow with JWT refresh rotation.',
                'question_2': 'Ensuring seamless Tailwind v4 compilation across all dark/light glass panels.',
                'question_3': 'Implement full-featured task and goals management system.',
                'mood': 'OPTIMAL',
                'energy_level': 9,
                'tags': ['Architecture', 'React', 'Django', 'Focus'],
                'entry_date': timezone.now().date()
            },
            {
                'title': 'System Telemetry Calibration',
                'content': 'Analyzed latency response cycles. Reduced average JWT authorization roundtrip to under 15ms. Maintaining deep focus flow state.',
                'question_1': 'Tuned PostgreSQL connection pool settings for sub-15ms query execution.',
                'question_2': 'Mild fatigue during late afternoon deep-work session.',
                'question_3': 'Refine daily journal three-question prompt workflow.',
                'mood': 'FOCUSED',
                'energy_level': 8,
                'tags': ['Performance', 'JWT', 'Security'],
                'entry_date': timezone.now().date() - datetime.timedelta(days=1)
            }
        ]

        for jd in journal_data:
            JournalEntry.objects.get_or_create(
                user=user,
                entry_date=jd['entry_date'],
                defaults=jd
            )
        self.stdout.write(self.style.SUCCESS("Seeded journal entries."))

        # Seed Notifications
        notifications_data = [
            {'title': 'Focus Session Completed', 'message': 'You completed a 45m Deep Work cycle on Zero-Trust Auth Protocol.', 'notification_type': 'SUCCESS', 'is_read': False},
            {'title': 'Security Audit Alert', 'message': 'System telemetry verified 0 high-severity code vulnerabilities.', 'notification_type': 'SECURITY', 'is_read': False},
            {'title': 'Goal Milestone Reached', 'message': 'JLPT N3 Kanji Core milestone marked as COMPLETED (+15% progress).', 'notification_type': 'MILESTONE', 'is_read': True},
        ]

        for nd in notifications_data:
            NotificationItem.objects.get_or_create(
                user=user,
                title=nd['title'],
                defaults=nd
            )
        self.stdout.write(self.style.SUCCESS("Seeded notification items."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully! All pages ready with real results."))
