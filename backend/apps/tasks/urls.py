from rest_framework.routers import DefaultRouter
from .views import TaskItemViewSet

router = DefaultRouter()
router.register(r'', TaskItemViewSet, basename='task')

urlpatterns = router.urls
