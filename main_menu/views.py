import random
import string
from django.template.loader import get_template
from django.template.response import TemplateResponse
from django.http import JsonResponse
import importlib
from django.utils.translation import gettext as _
import games
import os
from .models import ActiveGames
from project_couch import status


def game_selection(request):
    """
    Shows main menu
    """
    game_modules = [f'games.{item}' for item in os.listdir(os.path.dirname(games.__file__)) if not item.startswith("__")]

    available_games = []
    for module_str in game_modules:
        module = importlib.import_module(module_str)
        available_games.append({'name': getattr(module, 'name', module.__name__.replace('games.', '')),
                                'url': f'{module_str.replace("games.", "")}/',
                                'photo': getattr(module, 'photo', 'media/missing_game_image.png'),
                                'description': getattr(module, 'description', _('No description')),
                                'color': getattr(module, 'color', 'yellow')})

    response = TemplateResponse(
        request,
        template=get_template('main_menu.html'),
        context={'available_games': available_games},
    )
    return response


def join_game(request):
    return TemplateResponse(
        request,
        template=get_template('join_game.html'),
        context={},
    )


def connect_to_game(request):
    room_code = request.GET.get('roomCode').lower()
    player_name = request.GET.get('playerName')
    if not (room_code and player_name):
        return JsonResponse({'detail': 'Please provide room code and player name'}, status='400')

    try:
        active_game = ActiveGames.objects.get(room_code=room_code)
    except ActiveGames.DoesNotExist:
        return JsonResponse({'detail': 'Game not found'}, status='400')

    return JsonResponse({'redirectUrl': f'/{active_game.game_name}/'}, status='200')


def create_room(game_name):
    letters = string.ascii_lowercase
    room_code = ''.join(random.choice(letters) for _ in range(5)).lower()

    active_games = ActiveGames(game_name=game_name, room_code=room_code)
    active_games.save()

    return room_code


def close_room(game_name, room_code):
    try:
        active_game = ActiveGames.objects.get(game_name=game_name, room_code=room_code)
        active_game.delete()
        return True
    except ActiveGames.DoesNotExist:
        return False


def change_room_state(game_name, room_code, state):
    try:
        active_game = ActiveGames.objects.get(game_name=game_name, room_code=room_code)
        active_game.status = state
        active_game.save()
        return True
    except ActiveGames.DoesNotExist:
        return False


def change_room_data(game_name, room_code, data):
    try:
        active_game = ActiveGames.objects.get(game_name=game_name, room_code=room_code)
        active_game.data.update(data)
        active_game.save()
        return True
    except ActiveGames.DoesNotExist:
        return False
