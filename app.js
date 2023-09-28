//const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
//const dataSamples = d3.json(url);

//Case Surveillance API query
$.ajax({
    url: "https://data.cdc.gov/resource/n8mc-b4w4.json?res_state=CA",
    type: "GET",
    data: {
      "$limit" : 10000,
      "$$app_token" : "iwYpUxUglJyjEqOoTODioBzcV"
    }
}).done(function(data) {
  alert("Retrieved " + data.length + " records from the dataset!");
  //console.log(data);

  var json = JSON.stringify(data);
  console.log(json);
  //var fs = require('fs');
  //fs.writeFile('myjsonfile.json', json, 'utf8', callback);
});

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

