"""project_couch URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import importlib

from django.contrib import admin
from django.urls import path, include
from project_couch import errors
import games

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main_menu.urls')),
    path('missing_url/', errors.missing_url)
]

game_modules = [f'games.{item}' for item in dir(games) if not item.startswith("__")]
for module_str in game_modules:
    module = importlib.import_module(module_str)
    module_url = getattr(module, 'url', '')
    if module_url:
        urlpatterns.append(path(module_url, include(f'{module_str}.urls')))


