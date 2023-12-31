
var map = L.map('map').setView([37.8, -96], 4);
var baseLayer;
var dataByYear = {};  // To store GeoJSON data by year
function fetchDataForYear(year) {
    return fetch(`http://127.0.0.1:5000/api/v1.0/migration_data/${year}`)
    .then(response => response.json());
    }
        console.log(fetchDataForYear(2020))
        // Fetch data for year 2020 first
        fetchDataForYear(2020).then(data2020 => {
            dataByYear = { 2020: data2020 };
            initializeMigrationMap();  // Initialize the map with 2020 data
            // Fetch data for other years
            return Promise.all([
                fetchDataForYear(2017),
                fetchDataForYear(2018),
                fetchDataForYear(2019),
                fetchDataForYear(2021)
            ]);
}).then(([data2017, data2018, data2019, data2021]) => {
    dataByYear[2017] = data2017;
    dataByYear[2018] = data2018;
    dataByYear[2019] = data2019;
    dataByYear[2021] = data2021;
    // Calculate percentByYear data
    // percentByYear = {};
    // for(let year in dataByYear) {
    //     percentByYear[year] = dataByYear[year]['features'].map(feature => {
    //         let value = feature.properties.net_migration;
    //         let percentage = value >= 0 ?
    //             (feature.properties.inflow / (feature.properties.stayput + feature.properties.inflow)) * 100 :
    //             (feature.properties.outflow / (feature.properties.stayput + feature.properties.outflow)) * 100;
    //         return {feature,properties: {feature.properties,percentage: percentage
    //             }
    //         };
    //     });
    // }
    // Lazy load the content for the textboxes
    updateOutflowCountiesList();
    updateInflowCountiesList();
});
    var displayMode = "absolute";  // Default display mode
    function updateMapData() {
        let currentData = displayMode === "absolute" ? dataByYear[map_year] : percentByYear[map_year];
        map.eachLayer(function(layer) {
            if (layer !== baseLayer) {
                map.removeLayer(layer);
            }
        });
        L.geoJson(currentData, {
            style: function(feature) {
                var value = displayMode === "absolute" ? feature.properties.net_migration : feature.properties.percentage;
                return {
                    fillColor: getColorForValue(value),
                    weight: .01,
                    fillOpacity: .6
                };
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    var displayValue = displayMode === "absolute" ? feature.properties.net_migration : feature.properties.percentage + "%";
                    var netMigrationFormatted = new Intl.NumberFormat().format(displayValue);
                    var colorClass = feature.properties.net_migration >= 0 ? 'net-positive' : 'net-negative';
                    var tooltipContent = `<strong>${feature.properties.county}, ${feature.properties.state}</strong><br>
                                Net Migration: <span class="${colorClass}">${netMigrationFormatted}</span>`;
                    layer.bindTooltip(tooltipContent);
                }
            }
        }).addTo(map);
        updateOutflowCountiesList();
        updateInflowCountiesList();
    }
        function initializeMigrationMap() {
            var colorScale = chroma.scale('viridis').domain([-121000, 41000]);
            baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            updateMapData();
            map.invalidateSize();
            updateOutflowCountiesList();
            updateInflowCountiesList();
        }
        var map_year = 2020;  // Default map year
        function updateMapYear() {
            map_year = parseInt(document.getElementById('yearSlider').value);
            document.getElementById('yearLabel').textContent = "Year: " + map_year;
            updateMapData();
        }
        bins = [-122000, -10000, -5000, -3000, -2000, -1500, -1000, -500, -100, 0, 1000, 2000, 141000];
        const binsAbsolute = [-122000, -10000, -5000, -3000, -2000, -1500, -1000, -500, -100, 0, 1000, 2000, 141000];
        const binsPercent = [-100, -10, -1, 0, 1, 10, 100];
        const colors = bins.map((_, i) => chroma.scale('viridis')(i / (bins.length - 1)).hex());
        const currentBins = displayMode === "absolute" ? binsAbsolute : binsPercent;
        function getColorForValue(value) {
            const currentBins = displayMode === "absolute" ? binsAbsolute : binsPercent;
            for (let i = 0; i < currentBins.length - 1; i++) {
                if (value >= currentBins[i] && value < currentBins[i + 1]) {
                    return colors[i];
                }
            }
            return colors[colors.length - 1];
        }
        function updateOutflowCountiesList() {
            // Extract data for the given year
            let yearData = dataByYear[map_year]['features'];
            // Calculate percentage of outflow for each county
            yearData.forEach(item => {
                let properties = item.properties;
                properties.pct_out = (properties.outflow / (properties.stayput + properties.outflow)) * 100;
            });
            // Sort by pct_out in descending order
            yearData.sort((a, b) => a.properties.net_migration - b.properties.net_migration);
            // Extract top 10
            let top10Counties = yearData.slice(0, 10);
            // Build the list content
            let content = top10Counties.map(item => {
                let props = item.properties;
                let netMigrationFormatted = new Intl.NumberFormat().format(props.net_migration);
                return `<li>${props.county}, ${props.state} <span style="color:${props.net_migration > 0 ? 'green' : 'red'}">${netMigrationFormatted}</span> ${props.pct_out.toFixed(2)}%</li>`;
            }).join('');
            // Update the content of outflowCountiesList
            document.getElementById('outflowCountiesList').innerHTML = content;
        }
        function updateInflowCountiesList() {
            // Extract data for the given year
            let yearData = dataByYear[map_year]['features'];
            // Calculate percentage of inflow for each county
            yearData.forEach(item => {
                let properties = item.properties;
                properties.pct_in = (properties.inflow / (properties.stayput + properties.inflow)) * 100;
            });
            // Sort by pct_in in descending order
            yearData.sort((a, b) => b.properties.net_migration - a.properties.net_migration);
            // Extract top 10
            let top10Counties = yearData.slice(0, 10);
            // Build the list content
            let content = top10Counties.map(item => {
                let props = item.properties;
                let netMigrationFormatted = new Intl.NumberFormat().format(props.net_migration);
                return `<li>${props.county}, ${props.state} <span style="color:${props.net_migration > 0 ? 'green' : 'red'}">${netMigrationFormatted}</span> ${props.pct_in.toFixed(2)}%</li>`;
            }).join('');
            // Update the content of inflowCountiesList
            document.getElementById('inflowCountiesList').innerHTML = content;
        }
        // document.getElementById('percentButton').addEventListener('click', function() {
        //     displayMode = "percent";
        //     document.getElementById('percentButton').classList.add('active');
        //     document.getElementById('absoluteButton').classList.remove('active');
        //     updateMapData();
        // });
        // document.getElementById('absoluteButton').addEventListener('click', function() {
        //     displayMode = "absolute";
        //     document.getElementById('absoluteButton').classList.add('active');
        //     document.getElementById('percentButton').classList.remove('active');
        //     updateMapData();
        // });
        document.getElementById('yearSlider').addEventListener('input', updateMapYear);
        // document.querySelector('[data-view="migration"]').addEventListener('click', function(event) {
        //     if (!window.migrationMapInitialized) {
        //         initializeMigrationMap();
        //         window.migrationMapInitialized = true;
        //         document.querySelector('.migration-header').style.visibility = "visible";
        //         document.getElementById("mapContainer").style.visibility = "visible";
        //         document.getElementById("yearSlider").style.visibility = "visible";
        //         document.getElementById("yearLabel").style.visibility = "visible";
        //         document.getElementById("outflowCountiesBox").style.visibility = "visible";
        //         document.getElementById("inflowCountiesBox").style.visibility = "visible";
        //         document.querySelector('display-toggle-container').style.visibility = "visible";
        //     }
        // });

