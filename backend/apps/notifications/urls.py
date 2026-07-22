from rest_framework.routers import DefaultRouter
from .views import NotificationItemViewSet

router = DefaultRouter()
router.register(r'', NotificationItemViewSet, basename='notification')

urlpatterns = router.urls
