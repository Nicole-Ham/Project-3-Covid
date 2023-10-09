const vax_data = d3.json("http://127.0.0.1:5000/api/v1.0/vaccine_data");
vax_data.then(function (data) {
  //console.log(data);
  //console.log(Object.values(data.county));
  //console.log(Object.values(data.cumulative_up_to_date_count));
});

let vax_data_arr = null;

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

function uniqueArray4(a) {
  return [...new Set(a)];
}
//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates

//--------------------------------
//--------- Bar Plot Functions ---
//--------------------------------

function barTrace(x_vals, y_vals, year_val) {
  let trace = {
    x: x_vals,
    y: y_vals,
    name: year_val,
    type: "bar",
  };

  return trace;
}

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
  }

  for (let i = 0; i < type_arr.length; i++) {
    if (type_arr[i] == outcome) {
      if (year_arr[i] == 2020) {
        type_outcome_2020[month_arr[i]] += 1;
      } else if (year_arr[i] == 2021) {
        type_outcome_2021[month_arr[i]] += 1;
      } else if (year_arr[i] == 2022) {
        type_outcome_2022[month_arr[i]] += 1;
      } else {
        type_outcome_2023[month_arr[i]] += 1;
      }
    }
  }
  let type_outcome_dict = { 2020: type_outcome_2020, 2021: type_outcome_2021, 2022: type_outcome_2022, 2023: type_outcome_2023 };

  let type_bar_data = [];
  for (i in years) {
    type_bar_data.push(barTrace(Object.keys(type_outcome_dict[years[i]]), Object.values(type_outcome_dict[years[i]]), years[i]));
  }

  let bar_layout = {
    title: { text: "Hospitalizations Over Time" },
    xaxis: {
      title: {
        text: "Month",
        standoff: 20,
      },
    },
    yaxis: {
      title: {
        text: "Total Hospitalizations",
        standoff: 10,
      },
    },

    autosize: false,
    width: 525,
    height: 500,
    margin: {
      l: 75,
      r: 50,
      b: 120,
      t: 100,
      pad: 4,
    },
  };

  Plotly.newPlot("bar", type_bar_data, bar_layout);
}

//--------------------------------
//--------- Case Surv ------------
//--------------------------------

const case_data = d3.json("http://127.0.0.1:5000/api/v1.0/case_surv");
case_data.then(function (data) {
  let data_length = Object.values(data.age_group).length;

  //--------------------------------
  //--------- Dropdown -------------
  //--------------------------------

  let all_years = [2020, 2021, 2022, 2023];

  // let selector_start_year = d3.select("#selStart");
  // for(let i =0; i < counties.length; i++) {

  //   selector_county.append("option").text(counties[i]).property("value", counties[i]);
  // };

  let county_arr = Object.values(data.county);
  // county_arr.push(" ALL COUNTIES");
  let counties = uniqueArray4(county_arr); // get the unique counties,
  counties = counties.sort(); //sort them

  let selector_county = d3.select("#selCounty");
  selector_county.append("option").text("ALL COUNTIES");
  // add an option element for each county
  for (let i = 0; i < counties.length; i++) {
    selector_county.append("option").text(counties[i]).property("value", counties[i]);
  }

  let outcomes = ["Yes", "No", "Unknown"];

  let selector_outcome = d3.select("#selOutcome");
  for (let i = 0; i < outcomes.length; i++) {
    selector_outcome.append("option").text(outcomes[i]).property("value", outcomes[i]);
  }

  //--------------------------------
  //--------- Starter Graph Info ---
  //--------------------------------

  let data_keys = ["County:", "Outcome:"];

  let select_curr_settings = d3.select("#currSettings");
  let new_curr_settings_text = `<strong>${data_keys[0]}</strong> ALL COUNTIES <br> <strong>${data_keys[1]}</strong> UNKNOWN`;
  select_curr_settings.html(new_curr_settings_text);

  //--------------------------------
  //--------- Starter Hosp Bar -----
  //--------------------------------

  let all_hosp_arr = Object.values(data.hosp_yn);

  let all_months_arr = Object.values(data.month);
  let unique_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let all_years_arr = Object.values(data.year);

  plotBar("Unknown", all_years, all_hosp_arr, all_months_arr, all_years_arr, unique_months);

  //--------------------------------
  //--------- Pie Chart ------------
  //--------------------------------

  //------------------------
  //----- Update Page -----
  //------------------------

  d3.select("#selDeath").on("change", updateDeath);
  d3.select("#selHosp").on("change", updateHosp);
  d3.select("#selCounty").on("change", updateGen);
  d3.select("#selOutcome").on("change", updateGen);

  // d3.select("#selOutcome").on("change", updateBar);
  // //d3.select("#selType").on("change", updateBar);
  // //d3.select()
  // d3.select("#currSettings").on("change", updateBar);

  // // let curr_county_text = d3.select("#currSettings");
  // // curr_county_text.html(`&nbsp;&nbsp;&nbsp; <strong>Current County:</strong> ${selected_county}`);

  function updateDeath() {
    updateGen("death_yn");
  }

  function updateHosp() {
    updateGen("hosp_yn");
  }

  //this function is called when the selCounty value is changed
  function updateGen(/** @type {Event} */ $event) {
    const value = $event?.target?.value;
    updateBar($event);
    updateCurr($event);

    // only call makeScatter if the change is from county
    if (/** @type {HTMLElement} */ ($event.target).getAttribute("id") === "selCounty") {
      makeScatterPlot(vax_data_arr, value);
    }
  }

  function updateCurr(type) {
    let county_dropdown = d3.select("#selCounty");
    let selected_county = county_dropdown.property("value");

    let outcome_dropdown = d3.select("#selOutcome");
    let selected_outcome = outcome_dropdown.property("value");

    let select_curr_settings = d3.select("#currSettings");
    let new_curr_settings_text = `<strong>${data_keys[0]}</strong> ${selected_county} <br> <strong>${data_keys[1]}</strong> ${selected_outcome}`;
    select_curr_settings.html(new_curr_settings_text);
  }

  //------------------------
  //----- Update Plots -----
  //------------------------

  function updateBar(type) {
    let county_dropdown = d3.select("#selCounty");
    let selected_county = county_dropdown.property("value");

    let outcome_dropdown = d3.select("#selOutcome");
    let selected_outcome = outcome_dropdown.property("value");

    if (selected_county == "ALL COUNTIES") {
      plotBar(selected_outcome, all_years, all_hosp_arr, all_months_arr, all_years_arr, unique_months);
    } else {
      let curr_hosp_arr = [];
      let curr_months_arr = [];
      let curr_years_arr = [];
      for (let i = 0; i < data_length; i++) {
        if (data.county[i] == selected_county) {
          curr_hosp_arr.push(data.hosp_yn[i]);
          curr_months_arr.push(data.month[i]);
          curr_years_arr.push(data.year[i]);
        }
      }

      plotBar(selected_outcome, all_years, curr_hosp_arr, curr_months_arr, curr_years_arr, unique_months);
    }
  }
});
