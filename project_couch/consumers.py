import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.conf import settings
from project_couch import events, status
from main_menu.models import Games, Players


class GameConsumer(WebsocketConsumer):

    def connect(self):
        room_code = self.scope['url_route']['kwargs']['room_code'].lower()
        game_name = self.scope['url_route']['kwargs']['game_name']
        player_name = self.scope['url_route']['kwargs']['player_name']
        self.room_group_code = f'{game_name}_{room_code}'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_code,
            self.channel_name
        )

        self.accept()

        if not player_name == settings.HOST_NAME:  # Don't send event if host connected
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_code,
                {
                    'type': 'send_data',
                    'sender': settings.HOST_NAME,
                    'event': events.PLAYER_JOINED,
                    'data': {
                        'playerName': player_name,
                    },
                }
            )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_code,
            self.channel_name
        )

        room_code = self.scope['url_route']['kwargs']['room_code'].lower()
        game_name = self.scope['url_route']['kwargs']['game_name']
        player_name = self.scope['url_route']['kwargs']['player_name']
        game = Games.objects.get(name=game_name, room_code=room_code)

        if player_name != settings.HOST_NAME:
            player = Players.objects.get(name=player_name, game=game)
            if game.status == status.IN_GAME:
                player.status = status.NOT_ACTIVE
                player.save()
            else:
                player.delete()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_code,
            {
                'type': 'send_data',
                'sender': settings.HOST_NAME,
                'event': events.PLAYER_DISCONNECTED,
                'data': {
                    'playerName': player_name,
                },
            }
        )

        if player_name == settings.HOST_NAME:
            players = Players.objects.filter(game=game)
            for player in players:
                player.status = status.NOT_ACTIVE
                player.save()
            game.status = status.NOT_ACTIVE
            game.save()
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_code,
                {
                    'type': 'send_data',
                    'sender': settings.HOST_NAME,
                    'event': events.CLOSE_GAME,
                    'data': {},
                }
            )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        event = text_data_json.get('event')
        room_code = self.scope['url_route']['kwargs']['room_code'].lower()
        game_name = self.scope['url_route']['kwargs']['game_name']
        game = Games.objects.get(name=game_name, room_code=room_code)
        players = Players.objects.filter(game=game)

        if event == events.START_GAME:
            for player in players:
                player.status = status.IN_GAME
                player.save()
            game.status = status.IN_GAME
            game.save()

        if event == events.END_GAME:
            for player in players:
                player.status = status.NOT_ACTIVE
                player.save()
            game.status = status.NOT_ACTIVE
            game.save()

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_code,
            {
                'type': 'send_data',
                'sender': text_data_json.get('sender'),
                'event': text_data_json.get('event'),
                'data': text_data_json.get('data'),
            }
        )

    # Receive message from room group
    def send_data(self, data):

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'sender': data.get('sender'),
            'event': data.get('event'),
            'data': data.get('data'),
        }))
