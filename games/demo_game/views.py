from django.shortcuts import render
import random
import string
from django.template.loader import get_template
from django.template.response import TemplateResponse
from games import demo_game
from main_menu.models import ActiveGames, ActivePlayers
from django.conf import settings


def create_room(request):
    letters = string.ascii_lowercase
    room_code = ''.join(random.choice(letters) for _ in range(5)).lower()

    active_games = ActiveGames(game_name=demo_game.slug, room_code=room_code)
    active_games.save()

    return TemplateResponse(
        request,
        template=get_template('server.html'),
        context={
            'room_code': room_code,
            'game_name': demo_game.slug,
            'ws_url': f'ws://{request.META["HTTP_HOST"]}/demo_game/{room_code}/{settings.GAME_HOST_NAME}',
        },
    )


def join_game(request):
    room_code = request.GET.get('roomCode').lower()
    player_name = request.GET.get('playerName')

    return TemplateResponse(
        request,
        template=get_template('client.html'),
        context={
            'game_name': demo_game.slug,
            'player_name': player_name,
            'ws_url': f'ws://{request.META["HTTP_HOST"]}/{demo_game.url}{room_code}/{player_name}',
        },
    )
