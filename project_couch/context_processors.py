from django.conf import settings


def host_settings(request):
    return {
        'host_name': settings.HOST_NAME,

    }
