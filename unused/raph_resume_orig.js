$(function() {
	// Define settings for the map
	var width = $('#container').width();
	var height = width * 0.75;
	var x_origin = (width/2);
	var y_origin = (height/2);

	var first_level = 360;
	var second_level = 180;
	var third_level = 90;
	var first_level_size = 250;
	var second_level_size = 100;
	var third_level_size = 50;

	// Grab the data for the map
	var myObject = jobData;

	// Set the main canvas
	var paper = Raphael('myCanvas', width, height);
	var center_point = paper.circle(x_origin, y_origin, 5);
	center_point.attr({
		fill: 'red'
	});


	var circles = [];
	var first_level_degrees = first_level/myObject.length;
	var coordinate_string = '';
	var angle = 0;
	var i = 0;
	// Loop through and create the elements of the map
	while(angle < first_level) {
		// Different types of first level nodes get different lengths
		switch(myObject[i].Type) {
			case 'School':
				first_level_size = 100;
				break;
			case 'Association':
				first_level_size = 75;
				break;
			default:
				first_level_size = 200;
		}

		// Determine the coordinate string for the first level
		var coords = generate_path_coords(angle, x_origin, y_origin, first_level_size);
		coordinate_string += coords.path_string;

		// Add the circles to the array and draw them
		circles.push({"cx":coords.x_end, 
				    "cy":coords.y_end, 
				    "node_type":"job", 
				    "description":myObject[i].Company});

		// Determine the second level coordinates
		if(myObject[i].Experience != undefined) {
			// Determine the coordinate string for the second level
			var second_level_degrees = second_level/(myObject[i].Experience.length-1);
			if(myObject[i].Experience.length == 1) {
				var second_angle = angle;
			}
			else {
				var boundaries = calculate_node_boundaries(angle, second_level/2);
				var second_angle = boundaries.lower_boundary;				
			}

			// Generate the path coordinates for the second level
			for(var s=0; s<myObject[i].Experience.length; s++) {
				var second_level_coords = generate_path_coords(second_angle, coords.x_end, coords.y_end, second_level_size);
				coordinate_string += second_level_coords.path_string;

				// Add coordinates to draw circles later
				circles.push({"cx":second_level_coords.x_end, 
						    "cy":second_level_coords.y_end, 
						    "node_type":"experience", 
						    "description":myObject[i].Experience[s]});

				// Generate third level nodes
				var total = 0;
				for (var count in myObject[i].Experience[s].Skills) {
					total++;
				}
				var third_level_degrees = third_level/(total-1);

				if(total == 1) {
					var third_angle = second_angle;
				}
				else {
					var skill_boundaries = calculate_node_boundaries(second_angle, third_level/2);
					var third_angle = skill_boundaries.lower_boundary;
				}

				for(var t=0; t<total; t++) {
					var third_level_coords = generate_path_coords(third_angle, second_level_coords.x_end, second_level_coords.y_end, third_level_size);
					coordinate_string += third_level_coords.path_string;

					// Add coordinates to draw circles later
					circles.push({"cx":third_level_coords.x_end, 
								"cy":third_level_coords.y_end, 
								"node_type":"skill",
								"description":myObject[i].Experience[s].Skills[t].Description});

					third_angle += third_level_degrees;
				} 


				second_angle += second_level_degrees;
			}
		}
		// There was no experience section so go immediately to skills
		else {
			var total = 0;
			for(var count in myObject[i].Skills) {
				total++;
			}
			var third_level_degrees = third_level/(total-1);
			if(total==1) {
				var third_angle = angle;
			}
			else {
				var skill_boundaries = calculate_node_boundaries(angle, third_level/2);
				var third_angle = skill_boundaries.lower_boundary;
			}

			for(var t=0; t<total; t++) {
				var third_level_coords = generate_path_coords(third_angle, coords.x_end, coords.y_end, third_level_size);
				coordinate_string += third_level_coords.path_string;

				// Add coordinates to draw circles later
				circles.push({"cx":third_level_coords.x_end,
							  "cy":third_level_coords.y_end,
							  "node_type":"skill",
							  "description":myObject[i].Skills[t].Description});

				third_angle += third_level_degrees;
			}
		}

		// Increment the angle and iteration
		angle += first_level_degrees;
		i++;
	}
	// Draw the paths
	var path = paper.path(coordinate_string);
	path.attr({
		stroke: '#EDEDED'
	});
/*	var path = paper.path(original_path_string);
	path.attr({
		stroke: '#EDEDED'
	});
	path.animate({path:coordinate_string}, 1500, 'backOut');
*/

	// Draw the different types of circles for each of the nodes
	for(c in circles) {
		//Draw the circles
		switch(circles[c].node_type) {
			case 'experience':
				var experience_dot = paper.circle(circles[c].cx, circles[c].cy, 8);
				experience_dot.attr({
					fill: '#7AA139'
				});

				break;
			case 'skill':
				var skill_dot = paper.circle(circles[c].cx, circles[c].cy, 6);
				skill_dot.attr({
					fill: '#3EA1BA'
				});
				skill_dot.node.setAttribute("class", circles[c].description);
				break;
			default:
				var job_dot = paper.circle(circles[c].cx, circles[c].cy, 10);
				job_dot.attr({
					fill: '#C74242'
				});
				job_dot.node.onclick = function () {
    				c.attr("fill", "purple");
				};
		}
	}

	$('#javascript-filter').click(function(){
		$('.Analytics, .HTML, .Javascript').animate({
			opacity: 1
		});
		$('.Analytics, .HTML').animate({
			opacity: 0.10
		});
	});
	$('#analytics-filter').click(function(){
		$('.Analytics, .HTML, .Javascript').animate({
			opacity: 1
		});
		$('.Javascript, .HTML').animate({
			opacity: 0.10
		});
	});
	$('#html-filter').click(function(){
		$('.Analytics, .HTML, .Javascript').animate({
			opacity: 1
		});
		$('.Analytics, .Javascript').animate({
			opacity: 0.10
		});
	});



	// Animate the options dropdown
	$('#options').height("35px");
	$('#options ul, #options p').hide();
	$('#minimize').toggle(function() {
		$('#options').animate({
			height: "150px"
		}, 1000);
		$('#options ul, #options p').fadeIn();
		}, function() {
		$('#options').animate({
			height: "35px"
		}, 1000);
		$('#options ul, #options p').fadeOut();
	});

});




function generate_path_coords(angle, x_origin, y_origin, radius) {
	var deg2rad = Math.PI/180;
	var rad2deg = 180/Math.PI;

	if(angle >= 360) {
		angle -= 360;
	}
	var angle_from_ninety = angle % 90;
	var angle_radians = angle_from_ninety * deg2rad;

	sin_distance = Math.sin(angle_radians) * radius;
	cos_distance = Math.cos(angle_radians) * radius;

	// Determine the x and y coordinates for the node based on the angle of the node
	if ((angle >0) && (angle < 90)) {	// Top right hand quadrant relative to the origin
		x_end = x_origin + sin_distance;
		y_end = y_origin - cos_distance;
	}
	else if(angle == 90) { 		// Rightward straight line
		x_end = x_origin + radius;
		y_end = y_origin;
	}
	else if ((angle > 90) && (angle < 180)) { 	// Bottom right hand quadrant relative to the origin
		x_end = x_origin + cos_distance;
		y_end = y_origin + sin_distance;
	}
	else if(angle == 180) { 	// Downward vertical line
		x_end = x_origin;
		y_end = y_origin + radius;
	}
	else if((angle > 180) && (angle < 270)) { 	// Bottom left hand quadrant relative to the origin
		x_end = x_origin - sin_distance;
		y_end = y_origin + cos_distance; 
	}
	else if(angle == 270) {		// Leftward straight line
		x_end = x_origin - radius;
		y_end = y_origin;
	}
	else if((angle > 270) && (angle < 360)) {	// Top left hand quadrant relative to the origin
		x_end = x_origin - cos_distance;
		y_end = y_origin - sin_distance;
	}
	else { 	// Default is the first vertical line
		x_end = x_origin;
		y_end = y_origin - radius;
	}

	var path_array = {"path_string":'M' + x_origin + ' ' + y_origin + 'L' + x_end + ' ' + y_end,
					   "x_end":x_end,
					   "y_end":y_end};

	return path_array;
};

function calculate_node_boundaries(starting_degrees, angle_change) {
	// Determine the lower boundary for the node angle
	if((starting_degrees + angle_change) >= 360) {
		var upper_boundary = (starting_degrees + angle_change) - 360;
	}
	else {
		var upper_boundary = starting_degrees + angle_change;
	}
	
	// Determine the upper boundary for the node angle
	if((starting_degrees - angle_change) < 0) {
		var lower_boundary = 360 + (starting_degrees - angle_change);
	}
	else {
		var lower_boundary = starting_degrees - angle_change;
	}

	return {"lower_boundary":lower_boundary, "upper_boundary":upper_boundary};
};