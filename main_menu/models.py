from django.db import models

from project_couch import status


def get_default_game_data():
    return {'joined_players': [],
            'active_players': [],
            'options': {
             'allow_new_players': False,
            },
            'end_result': ''}


class ActiveGames(models.Model):
    game_name = models.CharField(max_length=255)
    room_code = models.CharField(max_length=5)
    data = models.JSONField(default=get_default_game_data)
    status = models.CharField(max_length=255, default=status.IN_LOBBY)


class ActivePlayers(models.Model):
    name = models.CharField(max_length=255)
    current_game = models.ForeignKey(ActiveGames, on_delete=models.CASCADE)
