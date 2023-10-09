
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

const vaccination_data = d3.json("http://127.0.0.1:5000/api/v1.0/vaccine_data");
vaccination_data.then((vaccines) => {
  vax_data_arr = vaccines;
  makeScatterPlot(vax_data_arr);
});

function makeScatterPlot(/** @type {Vaccine[]} */ vaccines_list, county = null) {
  console.log("vaccine_data ready for line chart", vaccines_list.length, county);
  // console.log(Object.values(data.Date));
  // console.log(Object.values(data.cumulative_up_to_date_count));

  //
  let trace = [
    {
      x: vaccines_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => `${x.year}-${x.month}`),
      y: vaccines_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.cumulative_up_to_date_count),
      name: "up_to_date",
      type: "scatter",
      marker: { size: 10 },
    },
    {
      x: vaccines_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => `${x.year}-${x.month}`),
      y: vaccines_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.cumulative_fully_vaccinated),
      type: "scatter",
      name: "full_vaxed",
      marker: { size: 10 },
    },
    {
      x: vaccines_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => `${x.year}-${x.month}`),
      y: vaccines_list.filter((data) => (![null, undefined, "", "ALL COUNTIES"].includes(county) ? data.county === county : true)).map((x) => x.cumulative_total_doses),
      type: "scatter",
      name: "total doses",
      marker: { size: 10 },
    },
  ];

  const layout = {
    title: "County Vaccination Numbers",
    xaxis: { title: "Date" },
    yaxis: { title: "Vaccination Counts" },
  };

  Plotly.newPlot("scatter", trace, layout);
}
