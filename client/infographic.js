var data;
var chart_data;
var selected_district = null;
var clicked_flag = false;
var selected_district_data = null;

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
  data = json;
});

d3.json("data/graphs.json", function(json) {
  chart_data = json;
});

function mouseover(d) {
  district_data = data[d.properties['dist_code']];
  d3.select("#info").classed("hide", false);
  d3.select("#intro").classed("hide", true);
  d3.select("#infoname").text(d.properties['NM_MICRO']);
  d3.select("#infovaluem").text(district_data[0]['msc']);
  d3.select("#infovaluep").text(district_data[0]['phd']);
  if(d.properties['dist_code'] == "LP"){
    d3.select("#infomicro").text("Microrregião onde está incluida a cidade de Parnaíba");
  }else if(d.properties['dist_code'] == "AG"){
    d3.select("#infomicro").text("Microrregião onde está incluida a cidade de Bom Jesus");
  }else if(d.properties['dist_code'] == "PC"){
    d3.select("#infomicro").text("Microrregião onde estão incluidas as cidades de Picos e Oeiras");
  }else if(d.properties['dist_code'] == "BP"){
    d3.select("#infomicro").text("Microrregião onde está incluida a cidade de Piripiri");
  }else d3.select("#infomicro").text("");
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
    d3.selectAll(".label").classed("label-info", false);
    d3.selectAll(".msc").classed("label-info", true);
    redraw(chart_data[selected_district_data.properties['dist_code']]);
    all_districts
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);
  };
  mouseover(selected_district_data);
}

var w = 435,
h = 200;
/*
colors = ["#9ECAE1", "#08306B"];*/


var svg = dimple.newSvg("#graphs", w, h);

function draw(data) {
  svg.selectAll('*').remove();
  var data_chart = data.mestrado;
  var chart = new dimple.chart(svg, data_chart);
  chart.addCategoryAxis("x", "area");
  chart.addMeasureAxis("y", "quantidade");
  chart.addSeries(null, dimple.plot.bar);
  chart.draw();
}

function redraw(data) {
  draw(data);
}

function drawPhd(data) {
  svg.selectAll('*').remove();
  var data_chart = data.doutorado;
  var chart = new dimple.chart(svg, data_chart);
  chart.addCategoryAxis("x", "area");
  chart.addMeasureAxis("y", "quantidade");
  chart.addSeries(null, dimple.plot.bar);
  chart.draw();
}

function change(a){
  d3.selectAll(".label").classed("label-info", false);
  d3.selectAll("."+a).classed("label-info", true);
  if (clicked_flag) {
    if(a =="msc"){
      mouseover(selected_district_data);
      draw(chart_data[selected_district_data.properties['dist_code']]);
    }else{
      mouseover(selected_district_data);
      drawPhd(chart_data[selected_district_data.properties['dist_code']]);
    }
  };
}
