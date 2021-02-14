from django.template.loader import get_template
from django.template.response import TemplateResponse, HttpResponse
from django.http import JsonResponse


def game_selection(request):
    """
    Shows main menu
    ToDo: Load games from database?

    """
    response = TemplateResponse(
        request,
        template=get_template('main_menu.html'),
        context={},
    )
    return response
