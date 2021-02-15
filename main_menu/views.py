from django.template.loader import get_template
from django.template.response import TemplateResponse, HttpResponse
from django.http import JsonResponse
import importlib
from django.utils.translation import gettext as _
import games


def game_selection(request):
    """
    Shows main menu
    ToDo:

    """
    game_modules = [f'games.{item}' for item in dir(games) if not item.startswith("__")]

    available_games = []
    for module_str in game_modules:
        module = importlib.import_module(module_str)
        available_games.append({'name': getattr(module, 'name', module.__name__),
                                'url': getattr(module, 'url', 'missing_url/'),
                                'photo': getattr(module, 'photo', 'media/missing_game_image.png'),
                                'description': getattr(module, 'description', _('No description')),
                                'color': getattr(module, 'color', 'yellow')})

    response = TemplateResponse(
        request,
        template=get_template('main_menu.html'),
        context={'available_games': available_games},
    )
    return response
