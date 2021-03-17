from .models import ActiveGames


def create_room(game_name):
    new_game = ActiveGames.objects.create(game_name=game_name)
    return new_game.room_code
