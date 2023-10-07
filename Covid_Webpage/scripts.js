document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([37.8, -96], 4);

    // Assume this is at the top of your script
    var colorScale = chroma.scale('viridis').domain([-121000, 41000]);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


// Define your bins.
const bins = [-130000, -4000, -3000, -2500, -500, 0, 500, 1000, 41000];

// Fetch colors corresponding to each bin's position on the 'viridis' scale.
const colors = bins.map((_, i) => chroma.scale('viridis')(i / (bins.length - 1)).hex());

// Function to get color based on value with explicit binning
function getColorForValue(value) {
    for (let i = 0; i < bins.length - 1; i++) {
        if (value >= bins[i] && value < bins[i + 1]) {
            return colors[i];
        }
    }
    return colors[colors.length - 1];  
}

fetch('../Data/migration_data.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            style: function(feature) {
                var value = feature.properties.net_migration; 
                return {
                    fillColor: getColorForValue(value), 
                    weight: .01,
              
                    fillOpacity: .7
                };
            }
        }).addTo(map);
    });


});
