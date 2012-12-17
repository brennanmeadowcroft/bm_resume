window.onload = function() {
	/*******************************************************************************************
	*	Set the variables used in the image
	*******************************************************************************************/
	var height = 750;
	var width = height;
	var first_level_total_degrees = 360;
	var first_level_radius = height * 0.25;

	var myObject = jobData;
	var first_level_degrees = first_level_total_degrees/myObject.length;
	var x_origin = width/2;
	var y_origin = width/2;

	/*******************************************************************************************
	*	Set the canvas
	*******************************************************************************************/
	var stage = new Kinetic.Stage({
		container: "myCanvas",
		width: height,
		height: width
	});
	var layer = new Kinetic.Layer();

	/*******************************************************************************************
	*	Loop through, calculate the coordinates and create the shapes
	*******************************************************************************************/
	for(var f = 0; f < myObject.length; f++) {
		var coords = first_layer_coords(f, x_origin, y_origin, first_level_radius, first_level_degrees, myObject[f].Type);

        var circle = new Kinetic.Circle({
			x: coords.x_end,
			y: coords.y_end,
			radius: (height * 0.015),
			fill: myObject[f].Color,
			stroke: 'black',
			strokeWidth: 2
        });
		
		var line = new Kinetic.Line({
			points: [{x:coords.x_start, y:coords.y_start},{x:coords.x_end, y:coords.y_end}],
			stroke: 'black',
			strokeWidth: 2
		});
		
		layer.add(line);
		layer.add(circle);

		if(myObject[f].Experience != undefined) {
		for(var s = 0; s < myObject[f].Experience.length; s++) {
			var second_nodes = 180/myObject[f].Experience.length;

			var second_coords = second_layer_coords(s, coords.x_end, coords.y_end, 50, second_nodes, coords.degrees);

	        var second_circle = new Kinetic.Circle({
				x: second_coords.x_end,
				y: second_coords.y_end,
				radius: 5,
				fill: 'blue',
				stroke: 'black',
				strokeWidth: 2
	        });
			
			var second_line = new Kinetic.Line({
				points: [{x:coords.x_end, y:coords.y_end},{x:second_coords.x_end, y:second_coords.y_end}],
				stroke: 'black',
				strokeWidth: 2
			});
			
			layer.add(second_line);
			layer.add(second_circle);



			for(var t = 0; t < myObject[f].Experience; t++) {
				var third_coords = third_layer_coords();
			}
		}
		}
	}

	/*******************************************************************************************
	*	Draw the shapes
	*******************************************************************************************/
	stage.add(layer);
};



/***************************************************************************************************
*	Functions for drawing the different layers
***************************************************************************************************/
function first_layer_coords(iteration, x_origin, y_origin, radius, degrees) {
	degrees = degrees_to_radians(degrees);

	// Figure out the angle of the line from the closest 90 degree arm
	var calc_degrees = (degrees * iteration) % 1.5707;
	var angle = (degrees * iteration);

	var x_end = '';
	var y_end = '';

	var deg_it = degrees * iteration;

	// Determine the x and y coordinates for the node based on the angle of the node
	if ((deg_it >0) && (deg_it <1.5707)) {	// Top right hand quadrant relative to the origin
		x_end = x_origin + (Math.sin(calc_degrees) * radius);
		y_end = y_origin - (Math.cos(calc_degrees) * radius);
	}
	else if(deg_it == 1.5707) { 		// Rightward straight line
		x_end = x_origin + radius;
		y_end = y_origin;
	}
	else if ((deg_it > 1.5707) && (deg_it < 3.1415)) { 	// Bottom right hand quadrant relative to the origin
		x_end = x_origin + (Math.sin(calc_degrees) * radius);
		y_end = y_origin + (Math.cos(calc_degrees) * radius);
	}
	else if(deg_it == 3.1415) { 	// Downward vertical line
		x_end = x_origin;
		y_end = y_origin + radius;
	}
	else if((deg_it > 3.1415) && (deg_it < 4.7124)) { 	// Bottom left hand quadrant relative to the origin
		x_end = x_origin - (Math.sin(calc_degrees) * radius);
		y_end = y_origin + (Math.cos(calc_degrees) * radius); 
	}
	else if(deg_it == 4.7124) {		// Leftward straight line
		x_end = x_origin - radius;
		y_end = y_origin;
	}
	else if((deg_it > 4.7124) && (deg_it < 6.2832)) {	// Top left hand quadrant relative to the origin
		x_end = x_origin - (Math.sin(calc_degrees) * radius);
		y_end = y_origin - (Math.cos(calc_degrees) * radius);
	}
	else { 	// Default is the first vertical line
		x_end = x_origin;
		y_end = y_origin - radius;
	}

	return {"x_start": x_origin, "y_start":y_origin, "x_end":x_end, "y_end":y_end, "degrees":angle};
};

function second_layer_coords(iteration, x_origin, y_origin, radius, degrees, starting_degrees) {
	starting_degrees = degrees_to_radians(starting_degrees);
	degrees = degrees_to_radians(degrees);

	if((starting_degrees + 1.5707) >= 6.2832) {
		var upper_boundary = (starting_degrees + 1.5707) - 6.2832;
	}
	else {
		var upper_boundary = starting_degrees + 1.5707;
	}
	
	if(starting_degrees < 1.5707) {
		var lower_boundary = 6.2832 + (starting_degrees - 1.5707);
	}
	else {
		var lower_boundary = starting_degrees - 1.5707;	
	}

	if (lower_boundary + (degrees * iteration) >= 6.2382) {
		var deg_it = (lower_boundary + (degrees * iteration)) - 6.2382;
	}
	else {
		var deg_it = lower_boundary + (degrees * iteration);
	}

	var calc_degrees = (lower_boundary + (degrees* iteration)) % 1.5707;
	var sin_distance = Math.sin(calc_degrees) * radius;
	var cos_distance = Math.cos(calc_degrees) * radius;

	var x_end = '';
	var y_end = '';

	// Determine the whether to add/subtract from y-coordinates/x-coordinates based on starting angle
	if((deg_it > 0) && (deg_it < 1.5707)) {
		x_end = x_origin + sin_distance;
		y_end = y_origin - cos_distance;
	}
	else if(deg_it == 1.5707) {
		x_end = x_origin + radius;
		y_end = y_origin;
	}
	else if((deg_it>1.5707) && (deg_it < 3.1415)) {
		x_end = x_origin + sin_distance;
		y_end = y_origin + cos_distance;
	}
	else if(deg_it == 3.1415) {
		x_end = x_origin;
		y_end = y_origin + radius;
	}
	else if((deg_it > 3.1415) && (deg_it < 4.7124)) {
		x_end = x_origin - sin_distance;
		y_end = y_origin + cos_distance;
	}
	else if(deg_it == 4.7124) {
		x_end = x_origin - radius;
		y_end = y_origin;
	}
	else if((deg_it > 4.7124) && (deg_it < 6.2382)) {
		x_end = x_origin - sin_distance;
		y_end = y_origin - cos_distance;
	}
	else {
		x_end = x_origin;
		y_end = y_origin - radius;
	}

	return {"x_start": x_origin, "y_start":y_origin, "x_end":x_end, "y_end":y_end, "degrees":deg_it};
};

function degrees_to_radians(degrees) {
	var radians = degrees * (Math.PI/180);

	return radians;
}

/***************************************************************************************************
*	Functions to draw different types of nodes
***************************************************************************************************/
function draw_job_node(x_start, y_start, x_end, y_end, layer) {
	var line = new Kinetic.Line({
		points: [{"x":x_start, "y":y_start},{"x":x_end, "y":y_end}],
		stroke: 'black',
		strokeWidth: 10
	});

/*	var circle = new Kinetic.circle({
		  x: x_end,
          y: y_end,
          radius: 25,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 2
	});
*/
	layer.add(line);
//	layer.add(circle);
};

function draw_experience_node(x_start, y_start, x_end, y_end, layer) {
	var line = new Kinetic.Line({
		points: [{x:x_start, y:y_start},{x:x_end, y:y_end}],
		stroke: 'black',
		strokeWidth: 4,
		name: 'job'
	});

	var circle = new Kinetic.circle({
		  x: x_end,
          y: y_end,
          radius: 25,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 2
	});

	layer.add(rect);
	layer.add(circle);

};
/*
function draw_school_node() {}
function draw_association_node() {}
function draw_skill_node() {}*/