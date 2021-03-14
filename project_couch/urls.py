import importlib
import os
from django.contrib import admin
from django.urls import path, include
from project_couch import errors
import games

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main_menu.urls')),
    path('missing_url/', errors.missing_url)
]

game_modules = [f'games.{item}' for item in os.listdir(os.path.dirname(games.__file__)) if not item.startswith("__")]
for module_str in game_modules:
    module_url_path = f'{module_str.replace("games.", "")}/'
    module_urls = path(module_url_path, include(f'{module_str}.urls'))
    urlpatterns.append(module_urls)
