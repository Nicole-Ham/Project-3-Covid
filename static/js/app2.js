function createBarChart(xData, yData, chartTitle, xLabel, yLabel) {
    const trace = {
        x: xData,
        y: yData,
        type: 'bar',
    };

    const layout = {
        title: chartTitle,
        xaxis: {
            title: xLabel,
        },
        yaxis: {
            title: yLabel,
        },
    };

    const data = [trace];

    Plotly.newPlot('chartDiv', data, layout);
}



  //--------------------------------
  //--------- FUNCTION -------------
  //--------------------------------

function updateGraph(zipCode) {
    // Use D3.js to fetch data from the API based on the ZIP code
    d3.json(`/api/data/${zipCode}`)
        .then(data => {
            // Update your graphs or UI based on the fetched data
            // ...

            // Example of creating a bar chart using Plotly
            const graph1Data = [
                {
                    x: data.employed_percentiles,
                    y: data.percent_fully_vaccinated,
                    type: 'bar',
                    name: 'Fully Vaccinated',
                },
                {
                    x: data.employed_percentiles,
                    y: data.percent_partially_vaccinated,
                    type: 'bar',
                    name: 'Partially Vaccinated',
                },
            ];

            const graph1Layout = {
                title: 'Vaccination by Employed Percentile',
                xaxis: { title: 'Employed Percentile' },
                yaxis: { title: 'Percentage' },
            };

            Plotly.newPlot('graph1', graph1Data, graph1Layout);
        })
        .catch(error => console.error('Error fetching data:', error));
}





  //------------------------------
  //--------- Search -------------
  //------------------------------

// Get the input field and a submit button
const zipCodeInput = document.getElementById('zipCodeInput');
const submitButton = document.getElementById('submitButton');

// Add an event listener to the submit button
submitButton.addEventListener('click', function () {
    // Get the user's input
    const zipCode = zipCodeInput.value;

    // Validate the ZIP code (simplified example)
    const validZipCodePattern = /^\d{5}$/;
    if (validZipCodePattern.test(zipCode)) {
        // ZIP code is valid; perform the search
        updateGraph(zipCode);
    } else {
        // Invalid ZIP code; display an error message
        alert('Please enter a valid 5-digit ZIP code.');
    }
});





//-----------------------
//----- Update Page -----
//-----------------------

/////Function to update the page based on the selected ZIP code
function updatezip_code() {
    const selectedZipCode = d3.select("#selZipCode").property("value");
    updateGraph(selectedZipCode); // Correct the capitalization of SelectedZipCode
}

d3.select("#selZipCode").on("change", updatezip_code); // Remove extra # character
