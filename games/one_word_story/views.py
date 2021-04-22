from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
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


@csrf_exempt
def save_result(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        room_code = data.get('roomCode')
        end_result = data.get('endResult')
        game_name = data.get('gameName')

        print(f'{room_code}\n{game_name}\n{end_result}')

        try:
            game = Games.objects.get(name=game_name, room_code=room_code)
        except Games.DoesNotExist:
            return JsonResponse({'detail': 'Game does not exist'}, status='400')

        game.data['end_result'].append(end_result)
        game.save()

        return JsonResponse({'detail': 'End result saved'}, status='200')
    return JsonResponse({'detail': f'Wrong request method used: {request.method}'}, status='403')