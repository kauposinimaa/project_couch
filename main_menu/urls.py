from django.urls import path, include
from main_menu import views

urlpatterns = [
    path('', views.game_selection),
]
