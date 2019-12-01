let p = L.CRS.EPSG3857.project(L.point(51.050407, 13.737262));

//var styles = {}
var currentYear = '2018';
var polygonToStadtraum = {};
var stadtraumData = {
        "17 Briesnitz und westliche OS": "Test"
};

//function ll(latLng) {
//	let m = matrixIds3857;
//	let t = L.latLng(latLng.lat, latLng.lng);
//	let topLeftCornerLatLng = L.CRS.EPSG3857.unproject(L.point(1302438.04228, 6746062.31756));
//	t.lat += topLeftCornerLatLng.lat;
//	t.lng += topLeftCornerLatLng.lng;
//	return t;
//}
//, {
//	maxBounds: L.latLngBounds(
//			ll(L.latLng(50, 15)),
//			ll(L.latLng(50, 15))),
//	minZoom: 0
//}
//debugger;
var map = L.map('mapid', {
}).setView([51.050407, 13.737262], 12);
var popup = L.popup();

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

//https://geodienste.sachsen.de/wmts_geosn_dop-strassen/guest?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities
//https://geodienste.sachsen.de/wmts_geosn_webatlas-sn/guest?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=WMTS&STYLE=default&FORMAT=image/png&TILEMATRIXSET=grid_3857&TILEMATRIX=03&TILEROW=00&TILECOL=00

//var matrixIds3857 = new Array(16);
//for (var i= 0; i<16; i++) {
//    matrixIds3857[i]= {
//        identifier    : (i < 10 ? "0"  : "" ) + i,
//        topLeftCorner : L.CRS.EPSG3857.unproject(L.point(1302438.04228, 6746062.31756))
//    };
//}

//let baseUrl = 

//getCapabilities('https://geodienste.sachsen.de/wmts_geosn_dop-strassen/guest');
//
//function getCapabilities(baseUrl) {
//
//	let data = {
//		SERVICE: 'WMTS',
//		VERSION: '1.0.0',
//		REQUEST: 'GetCapabilities'
//	};
//	
//	soap(baseUrl, data, (data) => {
//		let p = data;
//		debugger;
////		dataToFeatures(data)[0]["cls:L494"][0]["cls:PrimaryGeometry"][0]["gml:Point"][0]["gml:pos"][0]["jValue"].split(' ');
////		let longLatPoint = L.CRS.EPSG3857.unproject(L.point(p[0], p[1]));
////		popup
////		.setLatLng(longLatPoint).openOn(map);
//	});
//}


var tiles = L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );
//https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WMS&NODEID=664&TYPENAMES=L494&REQUEST=GetMap&CRS=urn:ogc:def:crs:EPSG::3857&LAYERS=L494&WIDTH=256&HEIGHT=256&FORMAT=image/png&BBOX=1517098.7891473596,6619214.0587287415,1549547.1160446499,6647502.3909583343

//var tiles =  new L.TileLayer.WMTS( 'https://geodienste.sachsen.de/wmts_geosn_webatlas-sn/guest?' , {
//	    layer: 'WMTS',
//	    style: "default",
//	    tilematrixSet: "grid_3857",
//	    format: "image/png",
//	    matrixIds: matrixIds3857
//	}
//);

//var dopStreets =  new L.TileLayer.WMTS( 'https://geodienste.sachsen.de/wmts_geosn_dop-strassen/guest?' , {
//	    layer: 'dop_strassen_hybrid',
//	    style: "default",
//	    tilematrixSet: "grid_3857",
//	    format: "image/png",
//	    matrixIds: matrixIds3857
//	}
//);

L.control.scale({'position':'bottomleft','metric':true,'imperial':false}).addTo(map);

map.addLayer(tiles);

//var libs = L.tileLayer.wms("https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WMS&NODEID=664", {
//    layers: 'L494',
//    format: 'image/png',
//    transparent: true,
//    CRS: 'urn:ogc:def:crs:EPSG::3857',
//    attribution: "Weather data © 2012 IEM Nexrad"
//}).addTo(map);
//var bezirke = L.tileLayer.betterWms("https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WMS&NODEID=189", {
//    layers: 'L138',
//    format: 'image/png',
//    transparent: true,
//    CRS: 'urn:ogc:def:crs:EPSG::3857',
//    attribution: "Weather data © 2012 IEM Nexrad"
//});

//bezirke.on({
//    mouseover: highlightFeature
//});
//
//bezirke.addTo(map);

var clinics = L.tileLayer.wms("https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WMS&NODEID=159", {
    layers: 'L88',
    format: 'image/png',
    transparent: true,
    CRS: 'urn:ogc:def:crs:EPSG::3857',
    attribution: "Weather data © 2012 IEM Nexrad"
});

var baseLayers = {
		"Web Atlas" : tiles
		
	};

var controlLayers={}; 
//= L.control.layers({"Web Atlas" : tiles}, {});
//.addTo(map);    

//map.on('click', onMapClick);
//
let wfsBaseUrl = 'https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WFS&REQUEST=GetFeature&srsName=urn:ogc:def:crs:EPSG::3857';
//addLibraries(wfsBaseUrl);
//addStadtteileViaSoap(wfsBaseUrl);
addData(addInitialData);

function onStadtraumClick(e) {
    if($('#sidebar').is(':hidden')) {
        let stadtraumName = polygonToStadtraum[e.target._leaflet_id];
        let data = stadtraumData[stadtraumName];
        updateSlider(stadtraumName);

        $('#happiness-amount').val(stadtraumData[stadtraumName]['Wohlbefinden']['default']);
        $('#sidebar').show("slide", { direction: "right" }, 750);
        
//        popup
//        .setLatLng(e.latlng)
//        .setContent("Stadtraum: " + stadtraumName + " Zufriedenheit: " + data['Wohlbefinden'][currentYear]['Glücksindex'])
//        .openOn(map);
    } else {
        $('#sidebar').hide("slide", { direction: "right" }, 750);
    }
}

function addInitialData(data) {
    stadtraumData = Object.assign(stadtraumData, data);
    addStadtteilePrefetched();
    let url = 'de-sn-dresden-kbu_-_einkommen_aequivalenz-_1993ff_stadtraum.csv';
    let indexCols = ['Stadtraum', 'Jahr'];
    let title = 'Einkommen';
    let targetCols = [currentYear, 'Einkommen-Haushalt (Äquivalenz-)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));
    
    url = 'de-sn-dresden-kbu_-_wohnkosten_1995ff_nach_stadtraum.csv';
    indexCols = ['Stadtraum', 'Jahr'];
    title = 'Wohnkosten';
    targetCols = [currentYear, 'Grundmiete'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));
    
    url = 'de-sn-dresden-einwohner_-_haushalte_md21e_1999_-_2018_od_bevoelkerung_ab_stadtbezirk_kinderanzahl_no_kids.csv';
    indexCols = ['Stadtraum', 'Jahr'];
    title = 'Anteil_Haushalte_ohne_Kinder_in_prozent';
    targetCols = [currentYear, 'Anteil_Haushalte_ohne_Kinder'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'de-sn-dresden-einwohner___md_33e_1999_-_2018_od_bevoelkerung_ab_stadtraum_hauptwohner_deutsche__auslaender_wohndauer.csv';
    indexCols = ['Stadtraum', 'Jahr'];
    title = 'Mittlere_Wohndauer';
    targetCols = [currentYear, 'mean_Wohndauer'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Bibliotheken.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Bibliotheken';
    targetCols = ['Bibliotheken (cls:L494)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Ausstellungen, Galerien.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Galerien';
    targetCols = ['Ausstellungen, Galerien (cls:L496)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Berufsbildende Schulen.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Berufsbildende_Schulen';
    targetCols = ['Berufsbildende Schulen (cls:L546)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Einkaufen & Service.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Lebensmittelmärkte';
    targetCols = ['Lebensmittelmärkte (cls:L700)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Grundschulen.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Grundschulen';
    targetCols = ['Grundschulen (cls:L542)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Gymnasien.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Gymnasien';
    targetCols = ['Gymnasien (cls:L545)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Horte.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Horte';
    targetCols = ['Horte (cls:L606)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    url = 'Kirchen, Religiöse Einrichtungen.csv';
    indexCols = ['Statistischer Bezirk'];
    title = 'Kirchen_Religiöse_Einrichtungen';
    targetCols = ['Kirchen, Religiöse Einrichtungen (cls:L121)'];
    addAggregatedCsvData(url, indexCols, addToStadtraumDataAndAddSlider.bind(this, title, targetCols));

    
}

function updateSlider(stadtraumName) {
    for(key in stadtraumData[stadtraumName]) {
        let slider = $('#'+key+'-slider');
        if(slider.length>0 && !stadtraumData[stadtraumName][key]['sliderinit']) {
            slider.slider({value: stadtraumData[stadtraumName][key]['default']});
            $( "#"+key+"-amount" ).val(stadtraumData[stadtraumName][key]['default']);
        }
    }
}

function addWms(dataTitle, cls) {
    controlLayers[dataTitle] = L.tileLayer.wms("https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WMS&NODEID=0", {
        layers: cls, //'L88',
        format: 'image/png',
        transparent: true,
        CRS: 'urn:ogc:def:crs:EPSG::3857',
        attribution: "Weather data © 2012 IEM Nexrad"
    });
    controlLayers[dataTitle]['added'] = false;
}

function addToStadtraumDataAndAddSlider(dataTitle, targetCols, data) {
    for(stadtraumName in stadtraumData) {
        if(typeof stadtraumData[stadtraumName][dataTitle] === 'undefined') {
            stadtraumData[stadtraumName][dataTitle] = {}
        }
        stadtraumData[stadtraumName][dataTitle] = data[stadtraumName];
        if(typeof stadtraumData[stadtraumName][dataTitle] !== 'undefined') {
            stadtraumData[stadtraumName][dataTitle]['sliderinit'] = false;
        }
    }
    
    let dataCb = (data, stadtraumName) => {
        data = data[dataTitle];
        if(typeof data === 'undefined') {
            return false;
        }
        for(col of targetCols) {
            data = data[col];
        }
        let result = parseFloat(data)
        if(dataTitle === 'Anteil_Haushalte_ohne_Kinder_in_prozent') {
            result = parseInt(result * 100)
        }
        if(dataTitle === 'Mittlere_Wohndauer') {
            result = parseInt(result)
        }
        if(targetCols[0].indexOf('cls:') > 0) {
            result = parseInt(result / 3);
        }
        stadtraumData[stadtraumName][dataTitle]['default'] = result;
        return result;
    }
    let min = dataMin(dataCb);
    let max = dataMax(dataCb);
        
    let label = $('<label for="'+dataTitle+'-amount">'+dataTitle.replace(/_/g, ' ')+':</label>');
    let input = $('<input type="text" id="'+dataTitle+'-amount" readonly style="width: 90px; margin-left: 10px; border:0; color:#f6931f; font-weight:bold;">');

    let colorTiles = $('<span class="sidebar-content__buttons"><span class="sidebar-content__button-label">&nbsp;&nbsp;&nbsp;&nbsp;Kartenfärbung&nbsp;</span><input type="radio" name="color" id="'+dataTitle+'-color" class="sidebar-content__button"></span>');
    $('#sidebar-content').append(colorTiles);
    colorTiles.click((e) => {
//    let stadtraumName = polygonToStadtraum[e.target._leaflet_id];
        let defaultStyle = {
                weight: 1,
                dashArray: '',
                fillOpacity: 0.4};
            for(poly in polygonToStadtraum) {
                let data = stadtraumData[polygonToStadtraum[poly]];
                let color;
                if($(e.target).is(':checked')) {
                    color = getColor(data[dataTitle]['default'], min, max);
                } else {
                    color = getColor(data['Wohlbefinden']['default'], min, max);
                }
                let style = Object.assign({color: color}, defaultStyle);
                map._layers[poly].setStyle(style);
            }
    })

    //    let layerToggle = $('<input type="checkbox" id="'+dataTitle+'-layer" style="margin-left: 10px;">');
    $('#sidebar-content').append(label);
    $('#sidebar-content').append(input);
//    $('#sidebar-content').append(layerToggleLabel);
    
    if(targetCols[0].indexOf('cls:') > 0) {
        let start = targetCols[0].indexOf('cls:')+4;
        let end = targetCols[0].indexOf(')');
        addWms(dataTitle, targetCols[0].substring(start,end));
        let layerToggle = $('<span class="sidebar-content__buttons"><span class="sidebar-content__button-label">Anzeigen</span><input type="checkbox" id="'+dataTitle+'-layer" class="sidebar-content__button"></span>');
        $('#sidebar-content').append(layerToggle);
        layerToggle.click((e) => {
//        let stadtraumName = polygonToStadtraum[e.target._leaflet_id];
            if(typeof controlLayers[dataTitle] !== 'undefined') {
                if(controlLayers[dataTitle]['added']) {
                    controlLayers[dataTitle].remove();
                    controlLayers[dataTitle]['added'] = false;
                } else {
                    controlLayers[dataTitle].addTo(map);
                    controlLayers[dataTitle]['added'] = true;
                }
            }
        })
    }
    
    let slider = $('<div id="'+dataTitle+'-slider"></div>');
    $('#sidebar-content').append(slider);

    if(typeof stadtraumData[stadtraumName][dataTitle] !== 'undefined') {
        stadtraumData[stadtraumName][dataTitle]['min'] = min;
        stadtraumData[stadtraumName][dataTitle]['max'] = max;
    }
    
    $( function() {
        $("#"+dataTitle+"-slider").slider({
            value:-1,
            min: min,
            max: max,
            step: 1,
            slide: function( event, ui ) {
              $( "#"+dataTitle+"-amount" ).val(  ui.value );
            }
        });
        $("#"+dataTitle+"-slider").attr('init', false);
        $("#"+dataTitle+"-slider").slider("disable");
        $( "#"+dataTitle+"-amount" ).val( $( "#"+dataTitle+"-slider" ).slider( "value" ));
    });
}

function addAggregatedCsvData(file_name, index_cols, successCb) {
    $.ajax({method: 'POST',
        url: '/map/opendata_dd_export_aggregated_csv/',
        dataType: 'json',
        data: {
            file_name: file_name,
            index_cols: index_cols
        },
        async: true,
        cache: false,
        success: function(data) {
            successCb(data);
        }
    });

}

function addData(successCb) {
    $.ajax({method: 'GET',
        url: '/map/opendata_dd_lebensbedingungen/',
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            successCb(data)
        }
    });
}

function dataMin(dataCb) {
    result = Infinity;
    for(let stadtraumName in stadtraumData) {
        let data = stadtraumData[stadtraumName];
        let t = dataCb(data,stadtraumName);
        if(t !== false)  {
            result = Math.min(result, t);
        }
    }
    return result;
}

function dataMax(dataCb) {
    result = -Infinity;
    for(let stadtraumName in stadtraumData) {
        let data = stadtraumData[stadtraumName];
        let t = dataCb(data,stadtraumName);
        if(t !== false)  {
            result = Math.max(result, t);
        }
    }
    return result;
}

function normalize(current, min, max) {
    return ((current - min) / ( max - min));
}

function getColor(current, min, max) {
    current = normalize(current, min, max);
    let color = interpolateLinearly(current, RdYlGn);
    let r = Math.round(255*color[0]);
    let g = Math.round(255*color[1]);
    let b = Math.round(255*color[2]);
    return "rgb("+r+","+g+","+b+")";
    
}

function addStadtteilePrefetched() {
    let bounds = JSON.parse(stadtraumBounds);
    let dataCb = (data) => {
        return data['Wohlbefinden'][currentYear]['Glücksindex'];
    }
    let min = dataMin(dataCb);
    let max = dataMax(dataCb);
    let label = $('<label for="happiness-amount">Zufriedenheit</label>');
    let input = $('<input type="text" id="happiness-amount" readonly style="margin-left: 10px; border:0; color:#f6931f; font-weight:bold;">');
    $('#sidebar-content').append(label);
    $('#sidebar-content').append(input);

    let colorTiles = $('<span style="float: right">Kartenfärbung&nbsp;<input type="radio" checked="checked" name="color" id="Wohlbefinden-color" style="margin-left: 10px;"></span>');
    $('#sidebar-content').append(colorTiles);
    colorTiles.click((e) => {
//    let stadtraumName = polygonToStadtraum[e.target._leaflet_id];
        let defaultStyle = {
                weight: 1,
                dashArray: '',
                fillOpacity: 0.4};
            for(poly in polygonToStadtraum) {
                let data = stadtraumData[polygonToStadtraum[poly]];
                let color = getColor(data['Wohlbefinden']['default'], min, max);
                let style = Object.assign({color: color}, defaultStyle);
                map._layers[poly].setStyle(style);
            }
    })
    $('#sidebar-content').append("<br/>");
    
    
    let defaultStyle = {
        weight: 1,
        dashArray: '',
        fillOpacity: 0.4};
    for(let key in bounds) {            
        let color = getColor(dataCb(stadtraumData[key]), min, max);
        stadtraumData[key]['Wohlbefinden']['default'] = normalize(dataCb(stadtraumData[key]), min, max) * 10;
        let style = Object.assign({ color: color}, defaultStyle);
        let polygon = L.polygon(bounds[key], style).addTo(map);
//
        polygonToStadtraum[polygon._leaflet_id] = key;
        polygon.on('click', onStadtraumClick);
        polygon.on('mouseover', highlightFeature);
        polygon.on('mouseout', () => polygon.setStyle(style));
        
//         // zoom the map to the polygon
    }
}

function addStadtteileViaSoap(wfsBaseUrl) {
    let typename = 'L138'
    let data = {
        nodeId : 0,
        typeNames: typename 
    };

    soap(wfsBaseUrl, data, (data) => {
        let features = dataToFeatures(data)
        features.forEach(function(feature) {
            let posList = feature["cls:"+typename][0]["cls:PrimaryGeometry"][0]["gml:Polygon"][0]["gml:exterior"][0]["gml:LinearRing"][0]["gml:posList"][0]["jValue"].split(' ');
            let latLngs = [];
            for(let i=0; i<Math.floor(posList.length/2); i++) {
                let p = L.CRS.EPSG3857.unproject(L.point(posList[i*2], posList[i*2+1]));
                latLngs.push([p.lat, p.lng]);
            }
            let polygon = turf.polygon([latLngs]);
            
            let stadtraumName = stadtraumMappings[feature["cls:"+typename][0]["cls:blocknr"][0]["jValue"]]

            if(typeof stadtraumData[stadtraumName] === 'undefined') {
                stadtraumData[stadtraumName] = {};
                stadtraumData[stadtraumName]['name'] = stadtraumName;
                stadtraumData[stadtraumName]['polygon'] = polygon;
            } else {
                stadtraumData[stadtraumName]['polygon'] = turf.union(stadtraumData[stadtraumName]['polygon'], polygon)
            }

        });
        
        let defaultStyle = {
                color: 'red',
                weight: 1,
                dashArray: '',
                fillOpacity: 0.4};
        //var textToSave = {};
        for(let key in stadtraumData) {
            let turfPolygon  = stadtraumData[key]["polygon"];
            //textToSave[key] = turfPolygon.geometry.coordinates[0];
            
            let polygon = L.polygon(turfPolygon.geometry.coordinates[0], defaultStyle).addTo(map);
//
            polygon.on('mouseover', highlightFeature);
            polygon.on('mouseout', () => polygon.setStyle(defaultStyle));
//         // zoom the map to the polygon
            map.fitBounds(polygon.getBounds());
        }
        //saveVarAsJsonFile(textToSave)
    });
}

function saveVarAsJsonFile(variable) {
    textToSave = JSON.stringify(variable);

    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'myFile.txt';
    hiddenElement.click();
}

function addLibraries(wfsBaseUrl) {
	let data = {
		nodeId : 664,
		typeNames: 'L494' 
	};

	soap(wfsBaseUrl, data, (data) => {
		let p = dataToFeatures(data)[0]["cls:L494"][0]["cls:PrimaryGeometry"][0]["gml:Point"][0]["gml:pos"][0]["jValue"].split(' ');
		let longLatPoint = L.CRS.EPSG3857.unproject(L.point(p[0], p[1]));
		popup
		.setLatLng(longLatPoint).openOn(map);
	});
}

function dataToFeatures(data) {
	return X2J.parseXml(data)[0]['wfs:FeatureCollection'][0]['wfs:member'];
}

function soap(url, data, successCb) {
	$.ajax({method: 'GET',
		url: url,
		data: data,
		dataType: 'xml',
		async: true,
		cache: false,
		success: function(data) {
			successCb(data);
		}
	});
}
//L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//	maxZoom: 18,
//	id: 'mapbox.streets',
//	accessToken: 'your.mapbox.access.token'
//}).addTo(mymap);