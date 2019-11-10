from django.shortcuts import render
from .scripts import stadtraum_mappings

# Create your views here.
def index(request):
    context = {}
    return render(request, 'map_app/index.html', context)

#def opendataDD\download