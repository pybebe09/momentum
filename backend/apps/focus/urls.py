from rest_framework.routers import DefaultRouter
from .views import FocusSessionViewSet

router = DefaultRouter()
router.register(r'', FocusSessionViewSet, basename='focus')

urlpatterns = router.urls
