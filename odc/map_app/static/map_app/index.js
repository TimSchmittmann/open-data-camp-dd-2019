let p = L.CRS.EPSG3857.project(L.point(51.050407, 13.737262));

function ll(latLng) {
	let m = matrixIds3857;
	let t = L.latLng(latLng.lat, latLng.lng);
	let topLeftCornerLatLng = L.CRS.EPSG3857.unproject(L.point(1302438.04228, 6746062.31756));
	t.lat += topLeftCornerLatLng.lat;
	t.lng += topLeftCornerLatLng.lng;
	return t;
}
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

var libs = L.tileLayer.wms("https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WMS&NODEID=664", {
    layers: 'L494',
    format: 'image/png',
    transparent: true,
    CRS: 'urn:ogc:def:crs:EPSG::3857',
    attribution: "Weather data © 2012 IEM Nexrad"
}).addTo(map);

var baseLayers = {
		"Web Atlas" : tiles
		
	};

L.control.layers(baseLayers, {"Bibliotheken " : libs}).addTo(map);    

map.on('click', onMapClick);

//
let wfsBaseUrl = 'https://kommisdd.dresden.de/net3/public/ogcsl.ashx?Service=WFS&REQUEST=GetFeature&srsName=urn:ogc:def:crs:EPSG::3857';
addLibraries(wfsBaseUrl);

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
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