import urllib.request 
import json

with open('csv.json') as json_file:
    elements = json.load(json_file)

    for element in elements:
        print(element['name'])
        urllib.request.urlretrieve(element['uri']+"/content", element['name']+".csv")