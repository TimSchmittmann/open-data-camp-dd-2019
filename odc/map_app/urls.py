from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('historie/', views.historie, name='historie'),
    path('opendata_dd_lebensbedingungen/', views.opendata_dd_lebensbedingungen, name='opendata_dd_lebensbedingungen'),
    path('opendata_dd_export_aggregated_csv/', views.opendata_dd_export_aggregated_csv, name='opendata_dd_export_aggregated_csv'),
]