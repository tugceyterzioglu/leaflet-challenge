d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    console.log(data);
    createFeatures(data.features);
});
var map = L.map("map").setView([37.09, -95.71], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);
function createFeatures(earthquakeData) {
    earthquakeData.forEach(feature => {
        var coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        L.circleMarker(coords, {
            radius: magnitude * 3,  // Scale magnitude
            color: "black",        // Black outline
            weight: 1,             // Thickness of the outline
            fillColor: getColor(depth), // Fill color based on depth
            fillOpacity: 0.7       // Transparency of the fill
        }).bindPopup(`
            <h3>${feature.properties.place}</h3><hr>
            <p>Magnitude: ${magnitude}</p>
            <p>Depth: ${depth} km</p>
        `).addTo(map);
    });
}
function getColor(depth) {
    return depth > 90 ? "#FF0000" :
           depth > 70 ? "#FF4500" :
           depth > 50 ? "#FFA500" :
           depth > 30 ? "#FFD700" :
           depth > 10 ? "#ADFF2F" :
                        "#00FF00";
}
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = ["#00FF00", "#ADFF2F", "#FFD700", "#FFA500", "#FF4500", "#FF0000"];
    div.innerHTML += '<strong>Depth (km)</strong><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> 
            ${grades[i]}${grades[i + 1] ? "&ndash;" + grades[i + 1] : "+"}<br>`;
    }
    return div;
};

legend.addTo(map);