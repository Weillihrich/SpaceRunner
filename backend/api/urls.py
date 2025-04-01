from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HighscoreViewSet

router = DefaultRouter()
router.register(r'highscores', HighscoreViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
