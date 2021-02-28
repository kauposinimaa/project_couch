from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'demo_game/(?P<room_code>\w+)/(?P<server>\w+)', consumers.DemoGameConsumer.as_asgi()),
]
