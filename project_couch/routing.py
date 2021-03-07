from django.urls import re_path

from project_couch import consumers

websocket_urlpatterns = [
    re_path(r'(?P<game_name>\w+)/(?P<room_code>\w+)/(?P<player_name>\w+)',
            consumers.GameConsumer.as_asgi()),
]
