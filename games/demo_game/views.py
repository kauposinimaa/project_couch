from django.shortcuts import render
import random
import string
from django.template.loader import get_template
from django.template.response import TemplateResponse
from main_menu.models import ActiveGames


def create_room(request):
    letters = string.ascii_lowercase
    room_code = ''.join(random.choice(letters) for _ in range(5)).lower()

    active_games = ActiveGames(game_name='demo_game', room_code=room_code)
    active_games.save()

    return TemplateResponse(
        request,
        template=get_template('server.html'),
        context={
            'room_code': room_code,
            'game_name': 'demo_game',
            'wsUrl': f'ws://{request.META["HTTP_HOST"]}/demo_game/{room_code}/true',
        },
    )


def join_game(request):
    room_code = request.GET.get('roomCode').lower()
    player_name = request.GET.get('playerName')
    return TemplateResponse(
        request,
        template=get_template('client.html'),
        context={
            'playerName': player_name,
            'wsUrl': f'ws://{request.META["HTTP_HOST"]}/demo_game/{room_code}/false',
        },
    )
