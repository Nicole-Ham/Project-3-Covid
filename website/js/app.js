//--------------------------------
//--------- functions ------------
//--------------------------------

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

//--------------------------------
//--------- data manip -----------
//--------------------------------

//const case_data = d3.json("../../data/CA_case_surv.json")
const case_data = d3.json("http://127.0.0.1:5000/api/v1.0/case_surv")
case_data.then(function(data) {

  console.log(data);

  // let data = {};
  // //let keys_list = []
  // for (row in json_data) {

  //   let row_values = Object.values(json_data[row]);

  //   //let keys = Object.keys(data[row]);
  //   //keys_list = [keys];
  //   //let row_values = json_data[row];
  //   //let row_id = row
  //   //let row_data = row_values.slice(1,12);
  //   //data[row_id] = row_values;
  // };

  // console.log(data);

  //--------------------------------
  //--------- dropdown -------------
  //--------------------------------

  let county_arr = Object.values(data.county);
  console.log(county_arr);
  let counties = uniqueArray4(county_arr);
  counties = counties.sort();

  let selector = d3.select("#selCounty");
  for(let i =0; i < counties.length; i++) {
        
    selector.append("option").text(counties[i]).property("value", counties[i]);
  }

  //--------------------------------
  //--------- hosp scatter ---------
  //--------------------------------

  let hosp_arr = Object.values(data.hosp_yn);

  let month_arr = Object.values(data.month);
  let year_arr = Object.values(data.year);

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
  let scatter_layout = {
  
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
  
  Plotly.newPlot("hosp_scatter", hosp_scatter_data, scatter_layout);

  //--------------------------------
  //--------- pie chart ------------
  //--------------------------------

});



