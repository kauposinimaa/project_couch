from django.db import models
from project_couch import status


class ActiveGames(models.Model):
    game_name = models.CharField(max_length=255)
    room_code = models.CharField(max_length=5)
    status = models.CharField(max_length=255, default=status.IN_LOBBY)


class ActivePlayers(models.Model):
    name = models.CharField(max_length=255)
    current_game = models.ForeignKey(ActiveGames, on_delete=models.CASCADE)
