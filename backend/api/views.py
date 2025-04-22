from rest_framework import viewsets
from .models import Highscore
from .serializers import HighscoreSerializer

class HighscoreViewSet(viewsets.ModelViewSet):
    queryset = Highscore.objects.all().order_by('-score')[:10]
    serializer_class = HighscoreSerializer
