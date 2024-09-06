
// Build the metadata panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
      // get the metadata field
      var metadata = data.metadata;
      // Filter the metadata for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      PANEL.html("");

      // Inside a loop, you will need to use d3 to append new
      // tags for each key-value in the filtered metadata.
      Object.entries(result).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
      // Get the samples field
      var samples = data.samples;
      // Filter the samples for the object with the desired sample number
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Get the otu_ids, otu_labels, and sample_values
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;

      // Bar Chart Maker
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [{
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
      }];

      var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          xaxis: { title: 'Number of Bacteria' },
          margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", barData, barLayout);

      // Build a Bubble Chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: 'Earth'
          }
      }];
      // Render the Bubble Chart
      var bubbleLayout = {
          title: 'Bacteria Cultures Per Sample',
          showlegend: false,
          height: 600,
          width: 1200,
          xaxis: { title: 'OTU ID' },
          hovermode: 'closest'
      };
     
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}

// Read data from samples.json
d3.json("samples.json").then(function(data) {
 
// Building the dropdown menu
var select = d3.select("#selDataset");
data.names.forEach((name) => {
    select.append("option")
        .text(name)
        .property("value", name);
});

// Changing the dropdown menu
select.on("change", function () {
    var newSample = d3.select(this).property("value");
    optionChanged(newSample);
});

// Using the first sample
var firstSample = data.names[0];
buildCharts(firstSample);
buildMetadata(firstSample);
// Setting up the initial sample for the gauge chart
buildGaugeChart(firstSample); 
});

// Function for event listener
function optionChanged(newSample) {
// Build charts and metadata panel each time a new sample is selected
console.log("New sample selected:", newSample);
buildCharts(newSample);
buildMetadata(newSample);
buildGaugeChart(newSample); 
}

function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();