from owslib.wfs import WebFeatureService
import xml.etree.ElementTree as ET
from shapely.geometry import Point, Polygon
import math
import csv

def containsUnnecessaryWord(s):
    return ('wässer' in s or 'Wässer' in s)
    
def fromNodeIdToCsv(targetNodeId):
    nodeId = '189'
    wfs = WebFeatureService(url='https://kommisdd.dresden.de/net3/public/ogcsl.ashx?NODEID='+nodeId+'&Service=WFS&', version='2.0.0')
    
    featureTypes = list(wfs.contents)
    
    statBezirke = {}
    
    statBezirkTextProperties = ['autoid', 'flaeche_m2', 'obj_id']
    
    for featureType in featureTypes:
        root = ET.fromstring(wfs.getfeature(typename=featureType).getvalue())
        for feature in root.iter('{http://www.cardogis.com/kommisdd}'+featureType[4:]):
            blockNr = feature.find('{http://www.cardogis.com/kommisdd}blocknr').text
            statBezirke[blockNr] = { 'Statistischer Bezirk': blockNr }
            for prop in statBezirkTextProperties:
                statBezirke[blockNr][prop] = feature.find('{http://www.cardogis.com/kommisdd}'+prop).text
            for polygon in feature.find('{http://www.cardogis.com/kommisdd}PrimaryGeometry'):
                for posList in polygon.iter('{http://www.opengis.net/gml/3.2}posList'):
                    statBezirke[blockNr]['polygon'] = posList.text
    for bezirk in statBezirke.values():
        coords = bezirk['polygon'].split(' ')
        points = []
        #print(len(coords))
        #print(math.floor(len(coords) / 2))
        for i in range(math.floor(len(coords) / 2)):
            points.append((float(coords[i * 2]), float(coords[i*2+1])))
        bezirk['polygon'] = Polygon(points)
    
    return transformToCsv(targetNodeId, statBezirke)
    
#     nodeId = '189'
#     for i in range(1397,1700):
#         try:
#             transformToCsv(i, statBezirke)
#         except Exception as err:
#             print('Error in NodeId: '+str(i))
#             print(err)

def transformToCsv(nodeId, statBezirke):
    wfs = WebFeatureService(url='https://kommisdd.dresden.de/net3/public/ogcsl.ashx?NODEID='+str(nodeId)+'&Service=WFS&', version='2.0.0')
    print('NodeId: '+str(nodeId)+' '+wfs.identification.title)
    if containsUnnecessaryWord(wfs.identification.title):
        print('Skipped Node: '+str(nodeId)+' '+wfs.identification.title)
        return 
    
    featureTypes = list(wfs.contents)
    
    featureTypeNames = {}
    
    for item in wfs.items():
        featureTypeNames[item[0]] = item[1].title+' ('+item[0]+')'
    
    totalFeatures = len(wfs.items())
    processedFeatures = 0
    addedFeatures = 0
        
    for featureType in featureTypes:
        print('Added: '+str(addedFeatures)+', Processed: '+str(processedFeatures)+', Total: '+str(totalFeatures))
        try:
            processedFeatures +=1
            root = ET.fromstring(wfs.getfeature(typename=featureType).getvalue())
            featureTypeName = featureTypeNames[featureType]
            if containsUnnecessaryWord(featureTypeName):
                print('Skipped feature: '+featureTypeName)
                del featureTypeNames[featureType]
                continue
            if len(list(root)) > 2000:
                print('Skipped feature: '+featureTypeName)
                del featureTypeNames[featureType]
                continue
            
            elements = list(root.iter('{http://www.cardogis.com/kommisdd}'+featureType[4:]))
            if len(elements) == 0 or len(list(elements[0].iter('{http://www.opengis.net/gml/3.2}pos'))) == 0:
                print('Skipped feature: '+featureTypeName)
                del featureTypeNames[featureType]
                continue
            for element in elements:
                #print(element)
                #for stadtteil in neighbor.iter('{http://www.cardogis.com/kommisdd}stadtteil'):
                #    print(stadtteil.text)
                for point in element.find('{http://www.cardogis.com/kommisdd}PrimaryGeometry'):
                    #print(point)
                    for pos in point.iter('{http://www.opengis.net/gml/3.2}pos'):
                        #print(pos)
                        for bezirk in statBezirke.values():
                            #print(bezirk)
                            if featureTypeName not in bezirk.keys():
                                bezirk[featureTypeName] = 0 
                            p = pos.text.split(' ')
                            posPoint = Point(float(p[0]), float(p[1]))
                            if posPoint.within(bezirk['polygon']):
                                bezirk[featureTypeName] += 1
            addedFeatures += 1
            print('Added feature: '+featureTypeName)
        except:
            print('Error. Skipped feature: '+featureTypeName)
            del featureTypeNames[featureType]
            continue
    if len(featureTypeNames) > 0:
        with open('map/scripts/csv/'+wfs.identification.title+'.csv', mode='w', newline='') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=['Statistischer Bezirk']+list(featureTypeNames.values()),extrasaction='ignore', delimiter=';')
        
            writer.writeheader()
            writer.writerows(statBezirke.values())
        
            return wfs.identification.title
    return False
        
#for i in range(1):
#    transformToCsv(i, statBezirke)


'''
for bezirk in statBezirke.values():
    if bezirk['Krankenhäuser'] > 0:
        print(bezirk)
        
        for geometry in neighbor.iter('{http://www.cardogis.com/kommisdd}PrimaryGeometry'):
            [0].iter('{http://www.opengis.net/gml/3.2}pos')[0])
'''