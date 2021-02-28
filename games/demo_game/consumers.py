import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class DemoGameConsumer(WebsocketConsumer):
    game_started = False

    def connect(self):
        if self.game_started:
            return

        self.room_code = self.scope['url_route']['kwargs']['room_code']

        self.room_group_code = f'game_{self.room_code}'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_code,
            self.channel_name
        )

        self.accept()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_code,
            {
                'type': 'send_data',
                'sender': 'server' if self.scope['url_route']['kwargs']['server'] == 'true' else 'client',
                'event': 'player_joined',
                'detail': 'Player joined',
            }
        )

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_code,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        sender = text_data_json.get('sender')
        event = text_data_json.get('event')
        detail = text_data_json.get('detail')

        if detail == 'start_game':
            self.game_started = True

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_code,
            {
                'type': 'send_data',
                'sender': sender,
                'event': event,
                'detail': detail,
            }
        )

    # Receive message from room group
    def send_data(self, data):
        sender = data.get('sender')
        event = data.get('event')
        detail = data.get('detail')

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'sender': sender,
            'event': event,
            'detail': detail,
        }))
