import random
import string
from django.db import models
from project_couch import status


def get_default_game_data():
    return {'options': {},
            'end_result': ''}


# Generates a unique room code
def generate_room_code():
    while True:
        room_code = ''.join(random.choice(string.ascii_lowercase) for _ in range(5)).lower()
        if not Games.objects.filter(room_code=room_code).exists():
            return room_code


class Games(models.Model):
    name = models.CharField(max_length=255)
    room_code = models.CharField(max_length=5, unique=True, default=generate_room_code)
    data = models.JSONField(default=get_default_game_data)
    status = models.CharField(max_length=255, default=status.IN_LOBBY)


class Players(models.Model):
    name = models.CharField(max_length=255)
    game = models.ForeignKey(Games, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, default=status.IN_LOBBY)
