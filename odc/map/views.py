from django.shortcuts import render
from .scripts import stadtraum_mappings
from .scripts import wsfToCsv
from django.http import JsonResponse
from django.conf import settings
from shapely.geometry import Point, Polygon
import os
import pandas as pd
from fileinput import filename
from django.http import FileResponse
from django.shortcuts import redirect

# Create your views here.
def index(request):
    context = {}
    return render(request, 'map/index.html', context)

def historie(request):
    context = {}
    return render(request, 'map/historie.html', context)

def wfs2Csv(request, node_id=False):
    if node_id is not False:
        filename = wsfToCsv.fromNodeIdToCsv(node_id)
        
        if filename is not False:
            response = FileResponse(open('map/scripts/csv/'+filename+'.csv', 'rb'))
            response['Content-Disposition'] = 'attachment; filename="'+filename+'.csv"'
            return response
        request.session['error'] = 'Keine verfügbaren Features für NodeId '+str(node_id)
        return redirect('/wfs2csv/')
    context = {}
    if 'error' in request.session:
        context['error'] = request.session['error']
        request.session['error'] = False
    return render(request, 'map/wfs2csv.html', context)

def add_data(current, remaining_index_cols, index_cols, row):
    if len(remaining_index_cols) == 0:
        for col in row[1].index:
            if col in index_cols:
                continue
            current[col] = row[1][col]
        return current

    col = remaining_index_cols.pop(0)
    
    if row[1][col] not in current:
        current[row[1][col]] = {} 
    current[row[1][col]] = add_data(current[row[1][col]], remaining_index_cols, index_cols, row)
    
    return current

def opendata_dd_export_aggregated_csv(request):
    file_name = request.POST.get('file_name')
    index_cols = request.POST.getlist('index_cols[]')
    df = pd.read_csv("map/scripts/csv/opendata_dresden/export/aggregated/"+file_name, 
                     sep=",", header=0, encoding = 'UTF-8')
    json = {}
    print(index_cols)
    for r in df.iterrows():
        json = add_data(json, index_cols.copy(), index_cols, r)
    return JsonResponse(json) 


def opendata_dd_lebensbedingungen(request):
    df = pd.read_csv("map/scripts/csv/opendata_dresden/export/aggregated/de-sn-dresden-kbu_-_lebensbedingungen_1993ff_gesundheit__wohlbefinden_nach_stadtraum.csv", 
                     sep=";", header=0, encoding = 'cp1252')
    json = {}
    for r in df.iterrows():
        if r[1].Stadtraum not in json:
            json[r[1].Stadtraum] = {}
        if r[1].Befindlichkeitsart not in json[r[1].Stadtraum]:
            json[r[1].Stadtraum][r[1].Befindlichkeitsart] = {}
        if r[1].Jahr not in json[r[1].Stadtraum][r[1].Befindlichkeitsart]:
            json[r[1].Stadtraum][r[1].Befindlichkeitsart][r[1].Jahr] = {}
            
        json[r[1].Stadtraum][r[1].Befindlichkeitsart][r[1].Jahr]['Anteil Benotung "gut"'] = r[1]['Anteil Benotung "gut"']
        json[r[1].Stadtraum][r[1].Befindlichkeitsart][r[1].Jahr]['Anteil Benotung "teils/teils"'] = r[1]['Anteil Benotung "teils/teils"']
        json[r[1].Stadtraum][r[1].Befindlichkeitsart][r[1].Jahr]['Anteil Benotung "schlecht"'] = r[1]['Anteil Benotung "schlecht"']
        
        gl_index = (float(r[1]['Anteil Benotung "gut"']) * 3
        + float(r[1]['Anteil Benotung "teils/teils"']) * 2
        + float(r[1]['Anteil Benotung "schlecht"']) * 1) / (
            float(r[1]['Anteil Benotung "gut"']) 
            + float(r[1]['Anteil Benotung "teils/teils"']) 
            + float(r[1]['Anteil Benotung "schlecht"']));
        json[r[1].Stadtraum][r[1].Befindlichkeitsart][r[1].Jahr]['Glücksindex'] = gl_index

    return JsonResponse(json) 

#opendata_dd_export_aggregated_csv(None, 'de-sn-dresden-kbu_-_einkommen_aequivalenz-_1993ff_stadtraum.csv' ,['Stadtraum', 'Jahr'])