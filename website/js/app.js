function scatterTrace(x_vals, y_vals) {

  let trace = {
    x: x_vals,
    y: y_vals,
    type: "scatter"
  };

  return trace;
};

function uniqueArray4(a) {
  
  return [...new Set(a)];
};
//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates

const data = d3.json("../../data/CA_case_surv.json")
data.then(function(case_data) {

  console.log(case_data);

  //--------------------------------
  //--------- hosp scatter ---------
  //--------------------------------

  let hosp_arr = Object.values(case_data.hosp_yn);

  let month_arr = Object.values(case_data.month);
  let year_arr = Object.values(case_data.year);

  let months = uniqueArray4(month_arr);
  months = months.sort((a,b) => a - b);

  let hosp_yes_2020 = {};
  let hosp_yes_2021 = {};
  let hosp_yes_2022 = {};
  let hosp_yes_2023 = {};

  for (i in months) {

    hosp_yes_2020[months[i]] = 0;
    hosp_yes_2021[months[i]] = 0;
    hosp_yes_2022[months[i]] = 0;
    hosp_yes_2023[months[i]] = 0;
  };
  
  for (let i = 0; i < hosp_arr.length; i++) {
    
    if (year_arr[i] == 2020) {

      hosp_yes_2020[month_arr[i]] += 1;
    }
    else if (year_arr[i] == 2021) {

      hosp_yes_2021[month_arr[i]] += 1;
    }
    else if (year_arr[i] == 2022) {
      
      hosp_yes_2022[month_arr[i]] += 1;
    }
    else {

      hosp_yes_2023[month_arr[i]] += 1;
    }
  };

  let hosp_yes_dict = {2020: hosp_yes_2020, 2021: hosp_yes_2021, 2022: hosp_yes_2022, 2023: hosp_yes_2023};
  let hosp_scatter_data = [scatterTrace(Object.keys(hosp_yes_dict[2020]), Object.values(hosp_yes_dict[2020])), scatterTrace(Object.keys(hosp_yes_dict[2021]), Object.values(hosp_yes_dict[2021])) ]
  Plotly.newPlot("hosp_scatter", hosp_scatter_data);

  //--------------------------------
  //--------- pie chart ------------
  //--------------------------------

});

//------------------------------------------------

// $.ajax({
      
//   type: "GET",
//   url: "CA_case_surv.csv",
//   dataType: "text/csv",
// }).done(function(data) {

//   alert("Retrieved " + data.length + " records from the dataset!");
//   console.log(data);
// });

//------------------------------------------------

// npm install sqlite3
// sudo apt install node-sqlite3

// const sqlite3 = require('sqlite3').verbose();
// let db = new sqlite3.Database("sqlite:///../data/CA_COVID_data.sqlite", (err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database.');
// });
// db.close();

//const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
//const dataSamples = d3.json(url);

//------------------------------------------------

// //Case Surveillance API query
// $.ajax({
//     url: "https://data.cdc.gov/resource/n8mc-b4w4.json?res_state=CA",
//     type: "GET",
//     data: {
//       "$limit" : 10000,
//       "$$app_token" : "iwYpUxUglJyjEqOoTODioBzcV"
//     }
// }).done(function(data) {
//   alert("Retrieved " + data.length + " records from the dataset!");
//   //console.log(data);

//   var json = JSON.stringify(data);
//   console.log(json);
//   //var fs = require('fs');
//   //fs.writeFile('myjsonfile.json', json, 'utf8', callback);
// });

// //Vaccinations Up-to-Date Status
// $.ajax({
//     url: "https://data.cdc.gov/resource/9b5z-wnve.json?Location=CA",
//     type: "GET",
//     data: {
//       "$limit" : 100000000,
//       "$$app_token" : "iwYpUxUglJyjEqOoTODioBzcV"
//     }
// }).done(function(data) {
//   alert("Retrieved " + data.length + " records from the dataset!");
//   //console.log(data);
// });

