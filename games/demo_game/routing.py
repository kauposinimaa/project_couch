from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/demo_game/', consumers.DemoGameConsumer.as_asgi()),
]