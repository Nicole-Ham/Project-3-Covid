//--------------------------------
//--------- Functions ------------
//--------------------------------

function barTrace(x_vals, y_vals) {

  let trace = {
    
    x: x_vals,
    y: y_vals,
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

  console.log(data);
  console.log(Object.values(data.age_group).length);

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
  }

  // let outcome_arr = Object.values(data.hosp_yn);
  // let outcomes = uniqueArray4(outcome_arr);
  // outcomes = outcomes.sort();
  let outcomes = ["Yes", "No", "Unknown"];
  console.log(outcomes);

  let selector_outcome = d3.select("#selOutcome");
  for(let i =0; i < counties.length; i++) {
        
    selector_outcome.append("option").text(outcomes[i]).property("value", outcomes[i]);
  }

  //--------------------------------
  //--------- Hosp Bar ---------
  //--------------------------------

  function hospBar(outcome, hosp_arr, month_arr, year_arr, unique_months_arr) {
    
    let hosp_yes_2020 = {};
    let hosp_yes_2021 = {};
    let hosp_yes_2022 = {};
    let hosp_yes_2023 = {};

    for (i in unique_months_arr) {

      hosp_yes_2020[unique_months_arr[i]] = 0;
      hosp_yes_2021[unique_months_arr[i]] = 0;
      hosp_yes_2022[unique_months_arr[i]] = 0;
      hosp_yes_2023[unique_months_arr[i]] = 0;
    };
  
    for (let i = 0; i < hosp_arr.length; i++) {
      
      if (hosp_arr[i] == outcome) {

        if (year_arr[i] == 2020) {hosp_yes_2020[month_arr[i]] += 1;}
        else if (year_arr[i] == 2021) {hosp_yes_2021[month_arr[i]] += 1;}
        else if (year_arr[i] == 2022) {hosp_yes_2022[month_arr[i]] += 1;}
        else {hosp_yes_2023[month_arr[i]] += 1;}
      }
    };
    let hosp_yes_dict = {2020: hosp_yes_2020, 2021: hosp_yes_2021, 2022: hosp_yes_2022, 2023: hosp_yes_2023};
  
    let hosp_bar_data = [barTrace(Object.keys(hosp_yes_dict[2020]), Object.values(hosp_yes_dict[2020])), barTrace(Object.keys(hosp_yes_dict[2021]), Object.values(hosp_yes_dict[2021])) ]
    let bar_layout = {
  
      autosize: false,
      width: 500,
      height: 500,
      margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
      }
    };
  
    Plotly.newPlot("hosp_bar", hosp_bar_data, bar_layout);
  };

    let all_hosp_arr = Object.values(data.hosp_yn);

    let all_months_arr = Object.values(data.month);
    let unique_months = uniqueArray4(all_months_arr);
    unique_months = unique_months.sort((a,b) => a - b);

    let all_years_arr = Object.values(data.year);

    hospBar("Yes", all_hosp_arr, all_months_arr, all_years_arr, unique_months);

    //--------------------------------
    //--------- Pie Chart ------------
    //--------------------------------

    //----------------------------------------------------------------------------
    //----- Update Page -----
    //----------------------------------------------------------------------------

    d3.select("#selCounty").on("change", updateCounty);
    d3.select("#selOutcome").on("change", updateOutcome);

  //----------------------------------------------------------------------------
  //----- Update Plots -----
  //----------------------------------------------------------------------------
        
    console.log(data.county[0]);
    console.log(data.hosp_yn[0]);

    // function changeVar() {

    //   let curr_hosp_arr = [];
    //   let curr_months_arr = [];
    //   let curr_years_arr = [];
    //   for (let i = 0; i < data_length; i++) {

    //     if (data.county[i] == selected_county) {

    //       curr_hosp_arr.push(data.hosp_yn[i]);
    //       curr_months_arr.push(data.month[i]);
    //       curr_years_arr.push(data.year[i]);
    //     };
    //   };
    // }

    function updateCounty() {

      let county_dropdown = d3.select("#selCounty");
      let selected_county = county_dropdown.property("value");

      let curr_county_text = d3.select("#currCounty");
      curr_county_text.html(`&nbsp;&nbsp;&nbsp; <strong>Current County:</strong> ${selected_county}`);

      if (selected_county == "ALL COUNTIES") {hospBar("Yes", all_hosp_arr, all_months_arr, all_years_arr, unique_months);}
      else {
        let curr_hosp_arr = [];
        let curr_months_arr = [];
        let curr_years_arr = [];
        for (let i = 0; i < data_length; i++) {

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

        hospBar("Yes", curr_hosp_arr, curr_months_arr, curr_years_arr, unique_months);
 
      }

    };

    function updateOutcome() {

      let outcome_dropdown = d3.select("#selOutcome");
      let outcome_county = outcome_dropdown.property("value");

      //console.log(outcome_county);




    };

});



