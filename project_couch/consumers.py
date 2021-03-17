import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.conf import settings
from project_couch import events, status
from main_menu import models
from main_menu import views


class GameConsumer(WebsocketConsumer):

    def connect(self):
        if not self.do_event(events.PLAYER_JOINED):
            self.close()
            return

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_code,
            self.channel_name
        )

        self.accept()

        if not self.player_name == settings.HOST_NAME:  # Don't send event if host connected
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_code,
                {
                    'type': 'send_data',
                    'sender': settings.HOST_NAME,
                    'event': events.PLAYER_JOINED,
                    'data': {
                        'playerName': self.player_name,
                        'gameStatus': self.room_status,
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
                'sender': settings.HOST_NAME,
                'event': events.PLAYER_DISCONNECTED,
                'data': {
                    'playerName': player_name,
                },
            }
        )

        self.do_event(events.PLAYER_DISCONNECTED)

        if player_name == settings.HOST_NAME:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_code,
                {
                    'type': 'send_data',
                    'sender': settings.HOST_NAME,
                    'event': events.GAME_CLOSED,
                    'data': {},
                }
            )

            self.do_event(events.GAME_CLOSED)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        sender = text_data_json.get('sender')
        event = text_data_json.get('event')
        data = text_data_json.get('data')

        self.do_event(event, data)

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

    def do_event(self, event, data=None):
        if data is None:
            data = {}
        room_code = self.scope['url_route']['kwargs']['room_code'].lower()
        game_name = self.scope['url_route']['kwargs']['game_name']
        active_game = models.ActiveGames.objects.get(room_code=room_code, game_name=game_name)
        self.player_name = self.scope['url_route']['kwargs']['player_name']

        if event == events.START_GAME:
            active_game.status = status.IN_GAME
            active_game.data['options'].update(data)
            active_game.data['active_players'] = active_game.data['joined_players']
            active_game.save()

        if event == events.PLAYER_DISCONNECTED:
            game_is_running = active_game.status == status.IN_GAME
            active_players = active_game.data['active_players']
            joined_players = active_game.data['joined_players']

            if game_is_running:
                if self.player_name in active_players:
                    active_game.data['active_players'].remove(self.player_name)
            else:
                if self.player_name in joined_players:
                    active_game.data['joined_players'].remove(self.player_name)

            active_game.save()

        if event == events.PLAYER_JOINED:
            game_is_running = active_game.status == status.IN_GAME
            allow_new_players = active_game.data['options']['allow_new_players']
            active_players = active_game.data['active_players']
            joined_players = active_game.data['joined_players']

            if game_is_running:
                if not allow_new_players and self.player_name not in joined_players:
                    return False
                if self.player_name in active_players:
                    return False
                active_game.data['active_players'].append(self.player_name)
            else:
                if self.player_name in joined_players:
                    return False
                active_game.data['joined_players'].append(self.player_name)

            active_game.save()
            self.room_group_code = f'{game_name}_{room_code}'
            self.room_status = active_game.status
            return True

        if event == events.GAME_CLOSED:
            active_game.status = status.NOT_ACTIVE
            active_game.save()
