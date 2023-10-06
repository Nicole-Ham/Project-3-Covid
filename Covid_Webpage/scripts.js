document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load your GeoJSON data (for simplicity, assuming it's an external file)
    fetch('path_to_your_geojson_file.geojson')
        .then(response => response.json())
        .then(data => {
            // Add choropleth layer here using the data
            L.geoJson(data, {
                style: function(feature) {
                    // Determine the style of each feature based on data values
                    // This is a basic example; adjust as needed
                    return {
                        fillColor: "some_color_based_on_data", 
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                }
            }).addTo(map);
        });
});
