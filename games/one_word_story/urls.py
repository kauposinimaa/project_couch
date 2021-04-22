from django.urls import path
from . import views

urlpatterns = [
    path('', views.join_room),
    path('save_result', views.save_result),
]
