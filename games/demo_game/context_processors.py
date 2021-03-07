from games import demo_game


def server_settings(request):
    return {
        demo_game.slug: {
            'name': demo_game.name,
            'url': demo_game.url,
            'description': demo_game.description,
        }
    }
