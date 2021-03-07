import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.conf import settings
from project_couch import events, status
from main_menu.models import ActiveGames


class GameConsumer(WebsocketConsumer):

    def connect(self):
        room_code = self.scope['url_route']['kwargs']['room_code']
        game_name = self.scope['url_route']['kwargs']['game_name']
        self.room_group_code = f'{game_name}_{room_code}'
        try:
            active_game = ActiveGames.objects.get(room_code=room_code, game_name=game_name)
        except ActiveGames.DoesNotExist:
            self.close()
            return

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_code,
            self.channel_name
        )

        self.accept()

        player_name = self.scope['url_route']['kwargs']['player_name']
        if not player_name == settings.GAME_HOST_NAME:  # Don't send event if host connected
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_code,
                {
                    'type': 'send_data',
                    'sender': settings.GAME_HOST_NAME,
                    'event': events.PLAYER_JOINED,
                    'data': {
                        'playerName': player_name,
                        'gameStatus': active_game.status,
                    },
                }
            )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_code,
            self.channel_name
        )

        player_name = self.scope['url_route']['kwargs']['player_name']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_code,
            {
                'type': 'send_data',
                'sender': settings.GAME_HOST_NAME,
                'event': events.PLAYER_DISCONNECTED,
                'data': {
                    'playerName': player_name,
                },
            }
        )

        if player_name == settings.GAME_HOST_NAME:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_code,
                {
                    'type': 'send_data',
                    'sender': settings.GAME_HOST_NAME,
                    'event': events.GAME_CLOSED,
                    'data': {},
                }
            )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        sender = text_data_json.get('sender')
        event = text_data_json.get('event')
        data = text_data_json.get('data')

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_code,
            {
                'type': 'send_data',
                'sender': sender,
                'event': event,
                'data': data,
            }
        )

    # Receive message from room group
    def send_data(self, data):
        sender = data.get('sender')
        event = data.get('event')
        data = data.get('data')

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'sender': sender,
            'event': event,
            'data': data,
        }))
