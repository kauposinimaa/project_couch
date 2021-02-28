from django.urls import path, include
from main_menu import views

urlpatterns = [
    path('', views.game_selection),
    path('join', views.join_game),
    path('connect', views.connect_to_game),
]
