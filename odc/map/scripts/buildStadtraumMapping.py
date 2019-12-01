from owslib.wmts import WebMapTileService

wmts = WebMapTileService('https://geodienste.sachsen.de/wmts_geosn_dop-strassen/guest')

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
        
    
