from abc import ABC, abstractmethod
import random

SYSTEM_PROMPT_DAILY_INSIGHT = """
You are Momentum AI Coach, an expert performance analyst for cybersecurity operators and high-velocity engineers.
Analyze the operator's telemetry (Tasks, Goals, Focus Sessions, Reflections):
- Tasks Completed: {tasks_completed} / {total_tasks}
- Total Focus Hours: {focus_hours}h
- Recent Journal Mood: {recent_mood}
- Active Strategic Goals: {active_goals}

Generate a concise, highly actionable daily insight with title, insight explanation, category type, recommendation, and actionable boolean.
"""

SYSTEM_PROMPT_WEEKLY_REPORT = """
You are Momentum AI Coach. Synthesize the weekly operational telemetry for operator {username}:
- Total Focus Sessions: {focus_sessions_count}
- Completed Goals: {completed_goals_count}
- Average Energy Rating: {avg_energy}/10

Generate a structured weekly audit report detailing weekly score (0-100), summary statement, key strengths, areas for improvement, action items, and productivity forecast.
"""

class BaseAIProvider(ABC):
    @abstractmethod
    def generate_daily_insight(self, context: dict) -> dict:
        """Generate daily actionable insight based on user tasks, goals, focus, and journal logs."""
        pass

    @abstractmethod
    def generate_weekly_report(self, context: dict) -> dict:
        """Generate structured weekly performance report."""
        pass

    @abstractmethod
    def answer_query(self, query: str, context: dict) -> str:
        """Answer custom operator question."""
        pass


class MockAIProvider(BaseAIProvider):
    def generate_daily_insight(self, context: dict) -> dict:
        username = context.get('user', 'Operator')
        tasks_count = context.get('tasks_count', 12)
        completed_count = context.get('completed_count', 8)
        focus_hours = context.get('focus_hours', 42.5)

        insights = [
            {
                "title": "Optimal Night Focus Detected",
                "insight": f"Operator {username}, you execute code and study better at night (20:00 - 23:00). Focus efficiency is 19% higher during evening cycles.",
                "type": "TIMING",
                "recommendation": "Schedule high-complexity tasks (e.g. Zero-Trust Auth Architecture) for evening focus sessions.",
                "actionable": True,
            },
            {
                "title": "High Velocity Milestone Progress",
                "insight": f"You completed {completed_count} out of {tasks_count} active backlog tasks with {focus_hours}h total deep work.",
                "type": "PERFORMANCE",
                "recommendation": "Maintain current 45-minute focus interval length for maximum flow state.",
                "actionable": False,
            },
            {
                "title": "Recovery Focus Alert",
                "insight": "You skipped recovery focus sessions twice this week. Maintaining balance prevents burnout during intense sprint cycles.",
                "type": "WELLNESS",
                "recommendation": "Schedule a 15-minute recovery interval after your next Pomodoro cycle.",
                "actionable": True,
            },
            {
                "title": "Japan Relocation & Exam Target Acceleration",
                "insight": "Your JLPT N2 Kanji and IELTS Band 8.5 milestone progress is executing 2x faster than forecasted deadline.",
                "type": "GOAL",
                "recommendation": "Begin drafting technical visa documentation ahead of Q4 schedule.",
                "actionable": True,
            }
        ]
        return random.choice(insights)

    def generate_weekly_report(self, context: dict) -> dict:
        username = context.get('user', 'Operator')
        return {
            "weeklyScore": 95,
            "summary": f"Outstanding operational output this week for {username}. High task velocity with 54 tasks completed and 97.8% peak focus rating.",
            "strengths": [
                "Exceptional focus endurance in 45-minute deep work cycles.",
                "Consistently high energy levels (8.8/10 average in journal reflections).",
                "Zero high-severity cybersecurity code vulnerabilities detected.",
            ],
            "areasForImprovement": [
                "Skipped 2 recovery break sessions during peak Wednesday cycle.",
                "SAT Reading drill velocity fell slightly behind target math velocity.",
            ],
            "actionItems": [
                "Schedule 15m recovery breaks between consecutive 45m sessions.",
                "Allocate 30 minutes daily to IELTS Academic Writing Task 2 prompts.",
                "Finalize Django REST Framework SimpleJWT endpoint security tests.",
            ],
            "productivityForecast": "+12% forecasted velocity boost for next week.",
        }

    def answer_query(self, query: str, context: dict) -> str:
        q = query.lower()
        if "night" in q or "time" in q:
            return "Based on your focus telemetry, your flow state peaks between 20:00 and 23:30. Consider reserving complex architecture tasks for evening cycles."
        if "ielts" in q or "sat" in q or "study" in q:
            return "Your academic study data shows steady progress (80% IELTS Band 8.5 target). Adding 20 minutes of daily flashcards will guarantee goal completion by Q4."
        return f"Analyzing operator telemetry for query: '{query}'. Your current momentum score of 94/100 indicates high operational readiness. Recommend prioritizing critical security backlog tasks."


def get_ai_provider() -> BaseAIProvider:
    # Pluggable factory allowing zero-code-churn substitution of OpenAI, Gemini, or Anthropic providers
    return MockAIProvider()
