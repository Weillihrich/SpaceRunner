from django.db import models

class Highscore(models.Model):
    player = models.CharField(max_length=100)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player} - {self.score}"
