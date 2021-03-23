from django.template.loader import get_template
from django.template.response import TemplateResponse
from django.http import JsonResponse
import importlib
from django.utils.translation import gettext as _
import games
import os
from .models import ActiveGames
from project_couch import status


# Pages

# Main menu page for game selection
def game_selection(request):
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


# Join page for clients to connect
def join_game(request):
    return TemplateResponse(
        request,
        template=get_template('join_game.html'),
        context={},
    )


# API endpoints

# Connects client to game
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


def active_players(request):
    if request.method == 'GET':
        try:
            active_game = ActiveGames.objects.get(
                room_code=request.GET.get('roomCode'),
                game_name=request.GET.get('gameName')
            )
        except ActiveGames.DoesNotExist:
            return JsonResponse({'detail': 'Game not found'}, status='400')

        return JsonResponse({'activePlayers': active_game.data.get('active_players')}, status='200')
    return JsonResponse({'detail': f'Wrong request method used: {request.method}'}, status='403')


def joined_players(request):
    if request.method == 'GET':
        try:
            active_game = ActiveGames.objects.get(
                room_code=request.GET.get('roomCode'),
                game_name=request.GET.get('gameName')
            )
        except ActiveGames.DoesNotExist:
            return JsonResponse({'detail': 'Game not found'}, status='400')

        return JsonResponse({'joinedPlayers': active_game.data.get('joined_players')}, status='200')
    return JsonResponse({'detail': f'Wrong request method used: {request.method}'}, status='403')


def end_result(request):
    if request.method == 'GET':
        try:
            active_game = ActiveGames.objects.get(
                room_code=request.GET.get('roomCode'),
                game_name=request.GET.get('gameName')
            )
        except ActiveGames.DoesNotExist:
            return JsonResponse({'detail': 'Game not found'}, status='400')

        return JsonResponse({'endResult': active_game.data.get('end_result')}, status='200')

    elif request.method == 'UPDATE':
        try:
            active_game = ActiveGames.objects.get(
                room_code=request.UPDATE.get('roomCode'),
                game_name=request.UPDATE.get('gameName')
            )
        except ActiveGames.DoesNotExist:
            return JsonResponse({'detail': 'Game not found'}, status='400')

        active_game.data['end_result'] = request.UPDATE.get('endResult')
        active_game.save()

        return JsonResponse({'detail': 'End result saved'}, status='204')
    return JsonResponse({'detail': f'Wrong request method used: {request.method}'}, status='403')
