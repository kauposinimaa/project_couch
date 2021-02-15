from django.shortcuts import render

# Create your views here.
from django.template.loader import get_template
from django.template.response import TemplateResponse


def placeholder(request):
    response = TemplateResponse(
        request,
        template=get_template('demo_game.html'),
        context={},
    )
    return response