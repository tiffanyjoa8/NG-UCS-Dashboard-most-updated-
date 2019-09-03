//control size+shape of the svg (scalable vector graphics)
// ************** Generate the tree diagram	 *****************
var margin = {top: 50, right: 120, bottom: 50, left: 120},
	width = 2900 - margin.right - margin.left, //north south 
	height = 2800 - margin.top - margin.bottom; //east west
	
var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

    // declares vars for the links  
var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //read in data from json file
    //root is first element in the treeData array (json)
d3.json("treedata.json", function(error, treedata)
{
    root = treedata[0];

	root.x0 = height / 2;
	root.y0 = 0;
	
	// draws the tree diagram
	update(root);
});

d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth. // determines horizontal spacing
  nodes.forEach(function(d) { d.y = d.depth * 150; });

//declare variable/function node so that when call node later, it will select the appropriate nodes with the right .ids
  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", openclosenode)
	//   .on("mouseover", click) EXPERIMENTING WITH .ON FUNCTIONS

	  //NEW STUFF (FOR MOUSEOVER)
      .on("mouseover", function seeinfo(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div .html(
            "Name: " + d.name + "<br/>" + 
            "Parent: " + d.parent + "<br/>" +
            "Progress: " + d.progress + "<br/>" +
            "ID: " + d.id + "<br/>"
            )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function hideinfo(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
		});
		

	  //NEW STUFF (FOR MOUSEOVER)
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


  nodeEnter.append("circle")
	  .attr("r", function(d) {return d.progress/10+2;})
      .style("fill", function(d) { 
		  //add if statements for "fill"/d.level and "stroke"/d.type
			//not a lot of progress
			if (d.progress <= 60)
			{
				d.level = "red";
			}

			//decent amount of progress
			else if (d.progress <= 99)
			{
				d.level = "yellow";
			}

			//completed ucs
			else
			{
				d.level = "green";
			}
			
			return d.level;})

      .style("stroke", function(d) {
	
			if (d.children) {
			  d.type = "black"
			} else {
			  d.type = "white"
			}
		return d.type;}); //"black" or none

		//for generalized dashboard with diff sizes
		// (d.progress/10 + 14) * -1 : d.progress/10 + 14 })
	  
//for node labels consistently on one line
  nodeEnter.append("text")
      .attr("y", function(d) { return d.children || d._children ? -15 : 22; })
	  .attr("dy", ".1em")
	  .attr("text-anchor", "middle")
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
	//   .attr("r", 10)
	//   .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

//use with node,enter().on("click", click) where click is referring to this definition of click
// Toggle children on click.

function openclosenode(d){

	//can only click on top most node (node.id is 73)
	if (d.id == 73){
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} 
		else {
			d.children = d._children;
			d._children = null;
		}
		update(d);
}
}


//OG CLICK FUNCTION WITH MOUSE CLICK
// function click(d) {
// 	if (d.children) {
// 		d._children = d.children;
// 		d.children = null;
// 	  } else {
// 		d.children = d._children;
// 		d._children = null;
// 	  }
// 	  update(d);
// 	}


