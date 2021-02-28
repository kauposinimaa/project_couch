from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.create_room),
    path('join', views.join_game),
]
