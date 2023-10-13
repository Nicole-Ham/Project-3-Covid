//--------------------------------
//--------- Functions ------------
//--------------------------------

function uniqueArray4(a) {
  
  return [...new Set(a)];
};
//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates

//--------------------------------
//--------- Bar Plot Functions ---
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

function plotBar(outcome, type_arr, month_arr, year_arr) {
 
  let type_outcome_2020 = {};
  let type_outcome_2021 = {};
  let type_outcome_2022 = {};
  let type_outcome_2023 = {};

  let unique_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  for (i in unique_months) {

    type_outcome_2020[unique_months[i]] = 0;
    type_outcome_2021[unique_months[i]] = 0;
    type_outcome_2022[unique_months[i]] = 0;
    type_outcome_2023[unique_months[i]] = 0;
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
  //console.log(type_outcome_dict);

  let all_years = [2020, 2021, 2022, 2023]; 

  let type_bar_data = [] ;
  for (i in all_years) {

    type_bar_data.push(barTrace(Object.keys(type_outcome_dict[all_years[i]]), Object.values(type_outcome_dict[all_years[i]]), all_years[i]));
  };

  let bar_layout = {

    title: {text:'Case Type Over Time'},
    xaxis: {title:{
      text: 'Month',
      standoff: 20
    }},
    yaxis: {title:{
      text: 'Total Cases',
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
//--------- Case Surv ------------
//--------------------------------

const case_data = d3.json("http://127.0.0.1:5000/api/v1.0/case_surv")
case_data.then(function(data) {

  let data_length = Object.values(data.age_group).length;

  //--------------------------------
  //--------- Dropdown -------------
  //--------------------------------

  let county_arr = Object.values(data.county);
  county_arr.push("ALL COUNTIES");
  let counties = uniqueArray4(county_arr);
  counties = counties.sort();
0
  let selector_county = d3.select("#selCounty");
  for(let i =0; i < counties.length; i++) {
        
    selector_county.append("option").text(counties[i]).property("value", counties[i]);
  };

  let outcomes = ["Yes", "No", "Unknown"];

  let selector_outcome = d3.select("#selOutcome");
  for(let i =0; i < outcomes.length; i++) {
        
    selector_outcome.append("option").text(outcomes[i]).property("value", outcomes[i]);
  };

  //--------------------------------
  //--------- Starter Graph Info ---
  //--------------------------------

  let data_keys = ["Case Type:", "County:", "Outcome:"];

  let select_curr_settings = d3.select("#currSettings");
  let new_curr_settings_text = `<strong>${data_keys[0]}</strong> Hospitalizations <br> <strong>${data_keys[1]}</strong> ALL COUNTIES <br> <strong>${data_keys[2]}</strong> UNKNOWN`;
  select_curr_settings.html(new_curr_settings_text);

  //--------------------------------
  //--------- Starter Hosp Bar -----
  //--------------------------------

  let all_hosp_arr = Object.values(data.hosp_yn);
  let all_months_arr = Object.values(data.month);
  let all_years_arr = Object.values(data.year);

  plotBar("Unknown", all_hosp_arr, all_months_arr, all_years_arr);

  //--------------------------------
  //--------- Pie Chart ------------
  //--------------------------------

  //------------------------
  //----- Update Page -----
  //------------------------

  d3.select("#selDeath").on("change", checkType);
  d3.select("#selHosp").on("change", checkType);
  d3.select("#selCounty").on("change", checkType);
  d3.select("#selOutcome").on("change", checkType);


  function checkType() {

    let selected_type = "";
    if(document.getElementById('selDeath').checked) {
      
      selected_type = "death_yn";
      console.log("death checked");
    }
    else if(document.getElementById('selHosp').checked) {
      
      selected_type = "hosp_yn";
      console.log("hosp_checked");
    };

    updateGen(selected_type);
  }

  function updateGen(type) {

    updateBar(type);
    updateCurr(type);
  };

  function updateCurr(type) {
    
    let type_name = "";
    if (type == "death_yn") {type_name = "Deaths"}
    else {type_name = "Hospitalizations"};

    let county_dropdown = d3.select("#selCounty");
    let selected_county = county_dropdown.property("value");

    let outcome_dropdown = d3.select("#selOutcome");
    let selected_outcome = outcome_dropdown.property("value");

    let select_curr_settings = d3.select("#currSettings");
    let new_curr_settings_text = `<strong>${data_keys[0]}</strong> ${type_name} <br> <strong>${data_keys[1]}</strong> ${selected_county} <br> <strong>${data_keys[2]}</strong> ${selected_outcome}`;
    select_curr_settings.html(new_curr_settings_text);
  };

  //------------------------
  //----- Update Bar -----
  //------------------------

  function updateBar(type) {

    console.log(type);

    let county_dropdown = d3.select("#selCounty");
    let selected_county = county_dropdown.property("value");
    //console.log(selected_county);

    let outcome_dropdown = d3.select("#selOutcome");
    let selected_outcome = outcome_dropdown.property("value");

    if (selected_county == "ALL COUNTIES") {
      
      if (type == "hosp_yn") {

        console.log(all_hosp_arr);
        plotBar(selected_outcome, all_hosp_arr, all_months_arr, all_years_arr);
      }
      else if (type == "death_yn") {

        let all_death_arr = Object.values(data.death_yn);
        console.log(all_death_arr);
        plotBar(selected_outcome, all_death_arr, all_months_arr, all_years_arr);
      }
    
    }
    else {

      let curr_type_arr = [];
      let curr_months_arr = [];
      let curr_years_arr = [];
      for (let i = 0; i < data_length; i++) {

        if (data.county[i] == selected_county) {

          if (type == "hosp_yn") {

            curr_type_arr.push(data.hosp_yn[i]);
          }
          else {

            curr_type_arr.push(data.death_yn[i]);
          }

          curr_months_arr.push(data.month[i]);
          curr_years_arr.push(data.year[i]);
        };
      };

      plotBar(selected_outcome, curr_type_arr, curr_months_arr, curr_years_arr);
    };
  }
});

