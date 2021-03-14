from games import one_word_story  # To access __ini__
from django.template.loader import get_template
from django.template.response import TemplateResponse
from django.conf import settings
from main_menu import views


def join_room(request):
    player_name = request.GET.get('playerName')
    room_code = request.GET.get('roomCode')
    game_name = one_word_story.__name__.replace('games.', '')
    template_name = 'client.html'

    if not(player_name and room_code):
        player_name = settings.GAME_HOST_NAME
        room_code = views.create_room(game_name)
        template_name = 'server.html'

    return TemplateResponse(
        request,
        template=get_template(template_name),
        context={
            'room_code': room_code,
            'game_name': game_name,
            'ws_url': f'ws://{request.META["HTTP_HOST"]}/{game_name}/{room_code}/{player_name}',
        },
    )
