from .models import Games


def create_room(game_name):
    new_game = Games.objects.create(name=game_name)
    return new_game.room_code


def delete_room(game_name, room_code):
    game = Games.objects.get(name=game_name, room_code=room_code)
    game.delete()

