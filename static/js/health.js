//----------------------------------------------------------------------------
//----- HPI ------------ --------------------------------------------------
//----------------------------------------------------------------------------

/**
 * @typedef {Object} HPIPov
 *  @property {any} county
 *  @property {any} percent_fully_vaccinated
 *  @property {any} percent_partiall_vaccinated
 *  @property {any} employed_percentile
 *  @property {any} hpi_value
 */

const hpi_data = d3.json("http://127.0.0.1:5000/api/vaccines_hpi_poverty");
hpi_data.then((hpi) => {
  hpi_data_arr = hpi;
  makeScatterPlot(hpi_data_arr);
});

function makeScatterPlot(/** @type {HPIPov[]} */ hpi_list, county = null) {
  console.log("hpi_data ready for line chart", hpi_list.length, county);
//   console.log(Object.values(data.Date));
//   console.log(Object.values(data.cumulative_up_to_date_count));

//   //

// function updateCurr(type) {
//     let county_dropdown = d3.select("#selCounty");
//     let selected_county = county_dropdown.property("value");

//     let select_curr_settings = d3.select("#currSettings");
//     let new_curr_settings_text = `<strong>${data_keys[0]}</strong> ${selected_county} <br><strong>${data_keys[1]}</strong> ${selected_outcome}`;
//     select_curr_settings.html(new_curr_settings_text);
//   }


  let trace = [
    {
      x: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.county),
      y: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.percent_fully_vaccinated),
      name: "Fully Vaccinated",
      type: "line",
      marker: { size: 10 },
    },
    // {
    //   x: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.county),
    //   y: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.percent_partiall_vaccinated),
    //   type: "line",
    //   name: "Partially Vaccinated",
    //   marker: { size: 10 },
    // },
    {
    x: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.county),
     y: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.employed_percentile),
    type: "line",
    name: "Employed Percentile",
    marker: { size: 10 },
    },
    {
    x: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.county),
    y: hpi_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.hpi_value),
    type: "line",
    name: "HPI Value",
    marker: { size: 10 },
      },

  ];

  const layout = {
    title: "County Vaccination Numbers",
    xaxis: { title: "County" },
    yaxis: { title: "Percentage" },
  };

  Plotly.newPlot("line", trace, layout);
}

// function updateLine(type) {
//     let county_dropdown = d3.select("#selCounty");
//     let selected_county = county_dropdown.property("value")
// }
