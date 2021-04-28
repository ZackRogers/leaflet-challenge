// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [0, -20],
    zoom: 3
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

function chooseColor(depth) {
    console.log(depth);
    switch (true) {
        case depth > 90:
            return "yellow";
        case depth > 70:
            return "red";
        case depth > 50:
            return "orange";
        case depth > 30:
            return "green";
        case depth < 31:
            return "purple";
    }
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(data => {
    console.log(data.features[10])

    data.features.forEach(obj => {
        var lat = obj.geometry.coordinates[1];
        var lng = obj.geometry.coordinates[0];
        var depth = obj.geometry.coordinates[2];
        var place = obj.properties.place;
        var mag = obj.properties.mag;
        L.circle([lat, lng], {
            radius: mag * 60000,
            color: 'black',
            weight: 1,
            fillColor: chooseColor(depth),
            fillOpacity: .8
        }).bindPopup(`<h4>${place}</h4><h4>Mag: ${mag}</h4>`).addTo(myMap)
    });

});

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = "<span style='background-color:yellow;border:2px solid black;padding:2px'> >90</span>\
                    <span style='background-color:red;border:2px solid black;padding:2px'> >70</span>\
                    <span style='background-color:orange;border:2px solid black;padding:2px'> >50</span>\
                    <span style='background-color:green;border:2px solid black;padding:2px'> >30</span>\
                    <span style='background-color:purple;border:2px solid black;padding:2px'> <31 </span>"
    return div;
};

legend.addTo(myMap)