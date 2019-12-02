from django.urls import path

from . import views

urlpatterns = [
    path('map/', views.index, name='index'),
    path('historie/', views.historie, name='historie'),
    path('wfs2csv/', views.wfs2Csv, name='wfs2CsvPage'),
    path('wfs2csv/<int:node_id>/', views.wfs2Csv, name='wfs2Csv'),
    path('map/opendata_dd_lebensbedingungen/', views.opendata_dd_lebensbedingungen, name='opendata_dd_lebensbedingungen'),
    path('map/opendata_dd_export_aggregated_csv/', views.opendata_dd_export_aggregated_csv, name='opendata_dd_export_aggregated_csv'),
]