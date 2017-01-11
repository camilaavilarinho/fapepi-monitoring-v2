var data; // loaded asynchronously
var chart_data;
var selected_district = null;
var clicked_flag = false;
var selected_district_data = null;
var all_data;

xy = d3.geo.mercator().translate([2500, -105]).scale(19000),
path = d3.geo.path().projection(xy);


var vis = d3.select("#chart")
.append("svg");

var districts = vis.append("g")
.attr("id", "districts")
.attr("class", "Blues");

all_districts = districts.selectAll("path");

d3.json("data/pi-micro0.json", function(json) {
  all_districts
  .data(json.features)
  .enter().append("path")
  .attr("class", "q4-9")
  .attr("d", path)
  .attr("id", function(d){return d.properties['dist_code'];})
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .on("click", function(d) { clicked(d, this); });

});

d3.json("data/data.json", function(json) {
  all_data = json;
  initialize();
});

function initialize(){
  data = all_data['16'][0];
};

d3.json("data/graphs.json", function(json) {
  chart_data = json;
});

function mouseover(d) {
 district_data = data[d.properties['dist_code']];
 d3.select("#info").classed("hide", false);
 d3.select("#intro").classed("hide", true);
 d3.select("#infoname").text(d.properties['NM_MICRO']);
 //d3.select("#infoyear").text(district_data[0]['acad_year']);
 d3.select("#infovaluem").text(district_data[0]['msc']);
 d3.select("#infovaluep").text(district_data[0]['phd']);
}

function mouseout(){
d3.select("#info").classed("hide", true);
d3.select("#intro").classed("hide", false);
}

function clicked(d, district){
selected_district_data = d;
if (clicked_flag == false) {
  selected_district = district;
  d3.select(district).classed("clicked", true);
  districts.selectAll("path").on("mouseout", null);
  districts.selectAll("path").on("mouseover", null);
  draw(chart_data[selected_district_data.properties['dist_code']]);
  clicked_flag = true;
}
else {
  old_district = selected_district;
  selected_district = district;
  d3.select(old_district).classed("clicked", false);
  d3.select(district).classed("clicked", true);
  redraw(chart_data[selected_district_data.properties['dist_code']]);
  all_districts
  .on("mouseover", mouseover)
  .on("mouseout", mouseout);
};
mouseover(selected_district_data);
}

//d3.select("#btn-phd").on("click", draw(data));


var n = 6, // number of samples
    m = 2; // number of series

    var w = 435,
    h = 200;
    /*
    colors = ["#9ECAE1", "#08306B"];*/

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return areas[i];
    })


    var svg = dimple.newSvg("#graphs", w, h);

    function draw(data) {
      svg.selectAll('*').remove();

      mest = data.mestrado;
      var chart = new dimple.chart(svg, mest);
      chart.addCategoryAxis("x", "name");
      chart.addMeasureAxis("y", "score");
      chart.addSeries(null, dimple.plot.bar);
      chart.draw();

   }

   function redraw(data) {
     draw(data);

  }
