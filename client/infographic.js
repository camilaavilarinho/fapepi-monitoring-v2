var data; // loaded asynchronously
var chart_data;
var selected_district = null;
var clicked_flag = false;
var selected_district_data = null;
var all_data;

xy = d3.geo.mercator().translate([2500, -105]).scale(19000),
path = d3.geo.path().projection(xy);


var svg = d3.select("#chart")
.append("svg");

var districts = svg.append("g")
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



ord = ['1', '2', '3', '4', '5', '6'];
areas = ["Comunicação", "Computação", "Agronomia", "Física", "História", "Biologia"];
var i = 0;

var n = ord.length, // number of samples
    m = 2; // number of series

    var w = 435,
    h = 150,
    colors = ["#9ECAE1", "#08306B"];
    /*x = d3.scale.linear().domain([50, 100]).range([0, h]),
    y0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .2),
    y1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, y0.rangeBand()]),
    colors = ["#9ECAE1", "#08306B"];*/


    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return areas[i];
    })

    var vis = d3.select("#graphs")
    .append("svg:svg")
    .append("svg:g")
    .attr("transform", "translate(10,10)");

    vis.call(tip);

    function draw(data) {

      var mest = data.mestrado;
      var max_n = 0;
			for (var d in mest) {
				max_n = Math.max(mest[d].score, max_n);
			}
      var dx = w / max_n;
			var dy = h / mest.length;
      

      var bars = vis.selectAll(".bar")
				.data(mest)
				.enter()
				.append("rect")
				.attr("class", function(d, i) {return "bar " + d.name;})
				.attr("x", function(d, i) {return 0;})
				.attr("y", function(d, i) {return dy*i;})
        .attr("fill", function(d, i) { return colors[i]; })
				.attr("width", function(d, i) {return dx*d.score})
				.attr("height", dy);

        // labels
			var text = vis.selectAll("text")
				.data(mest)
				.enter()
				.append("text")
				.attr("class", function(d, i) {return "label " + d.name;})
				.attr("x", 5)
				.attr("y", function(d, i) {return dy*i + 15;})
				.text( function(d) {return d.name + " (" + d.score  + ")";})
				.attr("font-size", "15px")
				.style("font-weight", "bold");

      /*var g = vis.selectAll("g")
      .data(data)
      .enter().append("svg:g")
      .attr("fill", function(d, i) { return colors[i]; })
      .attr("transform", function(d, i) { return "translate(" + y1(i) + ",0)"; });

      var rect = g.selectAll("rect");

      rect
      .data(function(data){return data;})
      .enter().append("svg:rect")
      .on("mouseover", tip.show)
      .on('mouseout', tip.hide)
      .attr("transform", function(d, i) { return "translate(" + y0(i) + ",0)"; })
      .attr("width", y1.rangeBand())
      .attr("height", x)
      .attr("class", function(d, i) {return i;})
      .transition()
      .delay(50)
      .attr("y", function(d) { return h - x(d); });

     var text = vis.selectAll("text")
     .data(d3.range(n))
     .enter().append("svg:text")
     .attr("class", "group")
     .attr("transform", function(d, i) { return "translate(" + y0(i) + ",0)"; })
     .attr("x", y0.rangeBand() / 2)
     .attr("y", h + 6)
     .attr("dy", ".71em")
     .attr("text-anchor", "middle")
     .text(function(d, i) { return ord[i]; }); // OBS: coloca o year no x axis*/

   }

   function redraw(data) {
    /*var g = vis.selectAll("g");
    g.data(data)
    .attr("fill", function(d, i) { return colors[i]; })
    .attr("transform", function(d, i) { return "translate(" + y1(i) + ",0)"; });

    g.selectAll("rect")
    .data(function(data){return data;})
    .attr("transform", function(d, i) { return "translate(" + y0(i) + ",0)"; })
    .attr("width", y1.rangeBand())
    .attr("height", x)
    .transition()
    .delay(50)
    .attr("y", function(d) { return h - x(d); });*/
  }
