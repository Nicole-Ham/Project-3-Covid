
const data = d3.json("../../data/CA_case_surv.json")
data.then(function(case_data) {

  console.log(case_data);

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

