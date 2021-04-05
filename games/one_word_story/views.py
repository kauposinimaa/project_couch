from games import one_word_story  # To access __ini__
from django.template.loader import get_template
from django.template.response import TemplateResponse
from django.conf import settings
from main_menu import views, utils
from main_menu.models import Games


def join_room(request):
    player_name = request.GET.get('playerName')
    room_code = request.GET.get('roomCode', '').lower()
    template_name = 'client.html'
    game_name = one_word_story.__name__.replace('games.', '')

    try:
        game = Games.objects.get(name=game_name, room_code=room_code)
    except Games.DoesNotExist:
        if not(player_name and room_code):
            player_name = settings.HOST_NAME
            game = Games.objects.create(name=game_name)
            template_name = 'server.html'
        else:
            raise ValueError('Game does not exist')

    return TemplateResponse(
        request,
        template=get_template(template_name),
        context={
            'game_name': game_name,
            'room_code': game.room_code,
            'player_name': player_name,
            'game_status': game.status,
        },
    )
