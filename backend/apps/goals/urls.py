from rest_framework.routers import DefaultRouter
from .views import GoalItemViewSet

router = DefaultRouter()
router.register(r'', GoalItemViewSet, basename='goal')

urlpatterns = router.urls
