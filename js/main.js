// A Web Map was created with Leaflet to show some Hiking Trails in the City of Salzburg.

// Part1: Creation of the map

//This variable creates the map by calling the ID mentioned in the .html file, the center of the map is defined and the zoom at which
//it is going to be displayed.
var map = L.map('map', {
	center: [47.80, 13.05],
	zoom: 12
});

//Part2: Add basemaps to my web map, openstreetmap is configured to display with the map.
	
var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
	
var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
	
var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});


//Basemaps variable is defined to use the basemaps in the control layers.

var baseMaps = {

	"OpenStreetMap": OpenStreetMap_DE,
	"Terrain": Stamen_Terrain,
	"Toner": Stamen_Toner
}

//Part 3: Adding the scale bar

L.control.scale({position:'bottomleft',imperial:false}).addTo(map);

//Part 4: Markers are added to the map

//All of the markers are selectable and show a popup with a brief description.

//The function is created to built popups when the marker is selected.
function popup(feature, layer) { 
if (feature.properties && feature.properties.ROUTE) 
{
	layer.bindPopup(feature.properties.ROUTE);
	}
}

//The layer is added and the popup function is called.
test = L.geoJson(points, { 
   onEachFeature: popup 
}) 
.addTo(map);



//Part5: Adding geojson data with the Salzburg district border and with the hiking routes and adding some functionalities. 

//A variable is defined and the geojson with the salzburg border is called by the variable.
var test2;

test2=L.geoJSON(Salzburg);


//A function to highlight the Salzburg polygon is built.
function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToBack();
        }
    }
	
//A function to reset the highlight of the Salzburg polygon is built.
    function resetHighlight(e) {
        test2.resetStyle(e.target);
    }
	
//A function that combines the highlightFeature function and the resetHighlight is built.
//Two interaction events are defined within, each mouse event for each function combined. 
function onEachFeature1(feature, layer) {
        layer.on({
            click: highlightFeature,
            mouseout: resetHighlight
        });
    }	

//Variable defining the style of the Salzburg polygon.	
	var polstyle = {
		"fillcolor": "#207AC9",
		"fillOpacity": 0.2,
        "color": "#207AC9",
        "weight": 4,
        "opacity": 1
    };

//The layer is added to the map and the combined function is called. 	
test2 = L.geoJSON(Salzburg, {
      style: polstyle,
      onEachFeature: onEachFeature1,
    }).addTo(map);
	
	
//Function to zoom features.	
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
	}

//Fnctionalities to zoom features is linked to an interaction event and to built a popup are combined in this function.
function onEachFeature3(feature, layer) {
        layer.on({
            click: zoomToFeature
        });
        if (feature.properties) {
            layer.bindPopup(feature.properties.name);
        }
    }
	
//Variable defining the style of the Hiking Trails layer.	
    var lineStyle = {
        "color": "#207AC9",
        "weight": 4,
        "opacity": 1
    };

//The Hiking Trails layer is added to the map by defining a variable that calls the geojson and references the style and functionality defined above.
    var water = L.geoJSON(Gaisbergspitze, {
      style: lineStyle,
      onEachFeature: onEachFeature3,
    }).addTo(map);
	
//A group of layers is created to be able to control the Salzburg polygon and the Hiking Trails features from the layers control.   
    var overlayMaps = {	
      "Hiking Trails": water,
	  "Salzburg": test2
    };
	
//Part6: Layers Control 
//The group of layers and the basemaps variables are called here using this layers control. 
//Gives users the ability to switch between different base layers and switch overlays on/off. 		
L.control.layers(baseMaps, overlayMaps, {position:'topleft'}).addTo(map);







