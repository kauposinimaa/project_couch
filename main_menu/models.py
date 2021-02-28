from django.db import models


class ActiveGames(models.Model):
    game_name = models.CharField(max_length=255)
    room_code = models.CharField(max_length=5)
