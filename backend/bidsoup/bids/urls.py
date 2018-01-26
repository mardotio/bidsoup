from django.urls import path
from . import views

urlpatterns = [
    path('bids/', views.test),
]
