from games import one_word_story  # To access __ini__
from django.template.loader import get_template
from django.template.response import TemplateResponse
from django.conf import settings
from main_menu import views, utils


def join_room(request):
    player_name = request.GET.get('playerName')
    room_code = request.GET.get('roomCode')
    template_name = 'client.html'
    game_name = one_word_story.__name__.replace('games.', '')

    # Values for game host
    if not(player_name and room_code):
        player_name = settings.HOST_NAME
        room_code = utils.create_room(game_name)
        template_name = 'server.html'

    return TemplateResponse(
        request,
        template=get_template(template_name),
        context={
            'game_name': game_name,
            'room_code': room_code,
            'player_name': player_name,
        },
    )
