from django.template.loader import get_template
from django.template.response import TemplateResponse


def missing_url(request):
    response = TemplateResponse(
        request,
        template=get_template('missing_url.html'),
        context={},
    )
    return response
