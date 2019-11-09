from owslib.wfs import WebFeatureService
import xml.etree.ElementTree as ET
 
nodeId = '159'
wfs = WebFeatureService(url='https://kommisdd.dresden.de/net3/public/ogcsl.ashx?NODEID='+nodeId+'&Service=WFS&', version='2.0.0')
wfs.identification.title

featureTypes = list(wfs.contents)

for featureType in featureTypes:
    root = ET.fromstring(wfs.getfeature(typename=featureType).getvalue())
    for neighbor in root.iter('{http://www.cardogis.com/kommisdd}'+featureType[4:]):
        for stadtteil in neighbor.iter('{http://www.cardogis.com/kommisdd}stadtteil'):
            print(stadtteil.text)
        

#wfs.getfeature(typename='cls:L532').getvalue()

#print(wfs.getfeature(typename='cls:L532', srsname='urn:x-ogc:def:crs:EPSG:3857'))
'''
wfs.getfeature(typename, filter, bbox, featureid, featureversion, propertyname, maxfeatures, srsname, outputFormat, method, startindex)

with open('epsg3857.js', 'w+') as file:
    matrices = wmts.tilematrixsets['grid_3857'].tilematrix
    file.write('var matrixIds3857 = new Array(' + str(len(matrices)) + ');\n')
    i = 0
    for matrix in matrices.values():
        file.write('matrixIds3857[' + str(i) + '] = { \n')
        file.write('    identifier: "' + matrix.identifier + '",\n')
        file.write('    topLeftCorner: L.point(' + str(matrix.topleftcorner[0]) + ', ' + str(matrix.topleftcorner[1]) + '),\n')
        file.write('    scaleDenominator: ' + str(matrix.scaledenominator) + '\n')
        file.write('};\n\n')
        i += 1
        
    
'''