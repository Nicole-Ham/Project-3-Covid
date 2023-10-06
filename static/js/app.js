
const vax_data = d3.json("http://127.0.0.1:5000/api/v1.0/vaccine_data")
vax_data.then(function(data) {
  
  //console.log(data);
  //console.log(Object.values(data.county));
  //console.log(Object.values(data.cumulative_up_to_date_count));
});

//   let trace = [{
    
//     x: data.month,
//     y: data.cumulative_up_to_date_count,
//     type: "scatter"
//   }];

//   Plotly.newPlot("scatter", trace);

// });

//--------------------------------
//--------- Functions ------------
//--------------------------------

function barTrace(x_vals, y_vals, year_val) {

  let trace = {
    
    x: x_vals,
    y: y_vals,
    name: year_val,
    type: "bar"
  };

  return trace;
};

function uniqueArray4(a) {
  
  return [...new Set(a)];
};
//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates

//--------------------------------
//--------- Case Surv ------------
//--------------------------------

//const case_data = d3.json("../../data/CA_case_surv.json")
const case_data = d3.json("http://127.0.0.1:5000/api/v1.0/case_surv")
case_data.then(function(data) {

  //console.log(data);
  //console.log(data.county);

  //console.log(Object.values(data.age_group).length);

  let data_length = Object.values(data.age_group).length;

  //--------------------------------
  //--------- Dropdown -------------
  //--------------------------------

  let county_arr = Object.values(data.county);
  county_arr.push("ALL COUNTIES");
  let counties = uniqueArray4(county_arr);
  counties = counties.sort();

  let selector_county = d3.select("#selCounty");
  for(let i =0; i < counties.length; i++) {
        
    selector_county.append("option").text(counties[i]).property("value", counties[i]);
  };

  // let types = ["Deaths" ,"Hospitalizations"];
  // let data_types = ["death_yn", "hosp_yn"];

  // let selector_type = d3.select("#selType");
  // for(let i =0; i < types.length; i++) {
        
  //   selector_type.append("option").text(types[i]).property("value", data_types[i]);
  // };

  let outcomes = ["Yes", "No", "Unknown"];
  //console.log(outcomes);

  let selector_outcome = d3.select("#selOutcome");
  for(let i =0; i < counties.length; i++) {
        
    selector_outcome.append("option").text(outcomes[i]).property("value", outcomes[i]);
  };

  //--------------------------------
  //--------- Bar Plot Function ----
  //--------------------------------

  function plotBar(outcome, years, type_arr, month_arr, year_arr, unique_months_arr) {
    
    let type_outcome_2020 = {};
    let type_outcome_2021 = {};
    let type_outcome_2022 = {};
    let type_outcome_2023 = {};

    for (i in unique_months_arr) {

      type_outcome_2020[unique_months_arr[i]] = 0;
      type_outcome_2021[unique_months_arr[i]] = 0;
      type_outcome_2022[unique_months_arr[i]] = 0;
      type_outcome_2023[unique_months_arr[i]] = 0;
    };
  
    for (let i = 0; i < type_arr.length; i++) {
      
      if (type_arr[i] == outcome) {
    
        if (year_arr[i] == 2020) {type_outcome_2020[month_arr[i]] += 1;}
        else if (year_arr[i] == 2021) {type_outcome_2021[month_arr[i]] += 1;}
        else if (year_arr[i] == 2022) {type_outcome_2022[month_arr[i]] += 1;}
        else {type_outcome_2023[month_arr[i]] += 1;}
      }
    };
    let type_outcome_dict = {2020: type_outcome_2020, 2021: type_outcome_2021, 2022: type_outcome_2022, 2023: type_outcome_2023};
    console.log(Object.values(type_outcome_dict["2020"]));
    
    //console.log(type_outcome_dict)
  
    let type_bar_data = [] ;
    for (i in years) {

      //console.log(years[i]);
      type_bar_data.push(barTrace(Object.keys(type_outcome_dict[years[i]]), Object.values(type_outcome_dict[years[i]]), years[i]));
      //console.log(years_data[1]);
    };

    //barTrace(Object.keys(type_outcome_dict[2020]), Object.values(type_outcome_dict[2020]), 2020), barTrace(Object.keys(type_outcome_dict[2021]), Object.values(type_outcome_dict[2021]), 2021), barTrace(Object.keys(type_outcome_dict[2022]), Object.values(type_outcome_dict[2022]), 2022), barTrace(Object.keys(type_outcome_dict[2023]), Object.values(type_outcome_dict[2023]), 2023) 
    //let type_bar_data = years_data;
    //console.log(type_bar_data);
    //console.log(type_bar_data[0]);
    let bar_layout = {
  
      title: {text:'Hospitalizations Over Time'},
      xaxis: {title:{
        text: 'Month',
        standoff: 20
      }},
      yaxis: {title:{
        text: 'Total Hospitalizations',
        standoff: 10
      }},

      autosize: false,
      width: 525,
      height: 500,
      margin: {
      l: 75,
      r: 50,
      b: 120,
      t: 100,
      pad: 4
      }
    };
  
    Plotly.newPlot("bar", type_bar_data, bar_layout);
  };

  //--------------------------------
  //--------- Starter Hosp Bar -----
  //--------------------------------

  let all_hosp_arr = Object.values(data.hosp_yn);
  //console.log(all_hosp_arr);

  let all_months_arr = Object.values(data.month);
  let unique_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //unique_months = unique_months.sort((a,b) => a - b);

  let all_years_arr = Object.values(data.year);
  // let years = uniqueArray4(all_years_arr);
  // years = years.sort((a,b) => a - b);
  //console.log(all_years_arr);

  let all_years = [2020, 2021, 2022, 2023]; 

  plotBar("Unknown", all_years, all_hosp_arr, all_months_arr, all_years_arr, unique_months);

  //--------------------------------
  //--------- Pie Chart ------------
  //--------------------------------

  //------------------------
  //----- Update Page -----
  //------------------------

  d3.select("#selCounty").on("change", updateBar);
  d3.select("#selOutcome").on("change", updateBar);
  //d3.select("#selType").on("change", updateBar);
  //d3.select()
  d3.select("#currSettings").on("change", updateBar);
  
  // let curr_county_text = d3.select("#currSettings");
  // curr_county_text.html(`&nbsp;&nbsp;&nbsp; <strong>Current County:</strong> ${selected_county}`);


  //------------------------
  //----- Update Plots -----
  //------------------------
      
  //console.log(data.county[0]);
  //console.log(data.hosp_yn[0]);

    function updateBar() {

      let county_dropdown = d3.select("#selCounty");
      let selected_county = county_dropdown.property("value");

      let outcome_dropdown = d3.select("#selOutcome");
      let selected_outcome = outcome_dropdown.property("value");

      if (selected_county == "ALL COUNTIES") {plotBar(selected_outcome, all_years, all_hosp_arr, all_months_arr, all_years_arr, unique_months);}
      else {

        let curr_hosp_arr = [];
        let curr_months_arr = [];
        let curr_years_arr = [];
        for (let i = 0; i < data_length; i++) {

          //console.log(data);
          //console.log(row["county"]);

          if (data.county[i] == selected_county) {

            curr_hosp_arr.push(data.hosp_yn[i]);
            curr_months_arr.push(data.month[i]);
            curr_years_arr.push(data.year[i]);
          };
        };
            //console.log(curr_hosp_arr);
            //console.log(curr_months_arr);
            //console.log(curr_years_arr);
            //console.log(curr_hosp_arr.length);

        plotBar(selected_outcome, all_years, curr_hosp_arr, curr_months_arr, curr_years_arr, unique_months);
 
      }

  };

});

//----------------------------------------------------------------------------
//----- Line Chart Vaccines --------------------------------------------------
//----------------------------------------------------------------------------

// fetch("/api/v1.0/vaccine_data") // Update the URL to your API endpoint
//   .then(response => response.json())
// .then(data => {
// Call a function to create the line chart with the fetched data
/**
 * line chart is 
 * x:counties-month
 * y: vaccine_couts
 */

/** 
 * @typedef {Object} Vaccine
*  @property {any} year
*  @property {any} month
*  @property {any} county
*  @property {any} cumulative_total_doses
*  @property {any} cumulative_fully_vaccinated
*  @property {any} cumulative_at_least_one_dose
*  @property {any} cumulative_up_to_date_count
 */

const vaccination_data = d3.json("http://127.0.0.1:5000/api/v1.0/vaccine_data")
vaccination_data.then(function (/** @type {Vaccine[]} */ vaccines_list) {
  
  console.log('vaccine_data ready for line chart',vaccines_list);
  // console.log(Object.values(data.Date));
  // console.log(Object.values(data.cumulative_up_to_date_count));

  //
  let trace = [{

    x: vaccines_list.map((x)=> `${x.year}-${x.month}`),
    y: vaccines_list.map(x=>x.cumulative_up_to_date_count),
    type: "scatter",
            marker: { size: 10 }
  }];

  const layout = {
    title: 'Cumulative Fully Vaccinated',
    xaxis: { title: 'Date' },
    yaxis: { title: 'Fully Vaccinated Count' }
};

  Plotly.newPlot("scatter", trace,layout);


});







