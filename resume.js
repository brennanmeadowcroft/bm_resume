$( document ).ready(function() {
	$.getJSON("resume_data.json", function(myObject){

		/************************************************************************************************
		*	Adjustable Settings For The Resume
		************************************************************************************************/
		var width = $('#container').width();
		var height = width * 0.75;
		var x_origin = (width/2);
		var y_origin = (height/2);
		var first_level = 360;
		var second_level = 180;
		var third_level = 90;
		var first_level_size = 250;
		var second_level_size = 100;
		var third_level_size = 40;

		var job_color = '#C74242';			// Red
		var experience_color = '#7AA139';	// Green
		var skill_color = '#3EA1BA';		// Blue
		var path_color = '#EDEDED';			// very light grey
		var glow_color = '#FFFFFF';


		/************************************************************************************************
		*	DO NOT EDIT SETTINGS BELOW
		************************************************************************************************/
		// Grab the data for the map

		// Set the main canvas
		var paper = Raphael('myCanvas', width, height);
		var circles = [];
		var coordinate_string = '';

		// Set the variables for the first level
		var first_level_degrees = first_level/myObject.length;
		var angle = 0;
		var i = 0;

		// Loop through and create the elements of the map
		while(angle < first_level) {
			// Different types of first level nodes get different lengths
			switch(myObject[i].Type) {
				case 'School':
					first_level_size = 150;
					break;
				case 'Association':
					first_level_size = 75;
					break;
				default:
					first_level_size = 200;
			}

			// Determine the coordinate string for the first level
			var coords = generate_path_coords(angle, x_origin, y_origin, first_level_size);
			coordinate_string = coords.path_string;
			var path = paper.path(coordinate_string);
			path.attr({
				stroke: path_color,
				'stroke-width': '6px',
				'stroke-linecap': "round",
				'stroke-linejoin': "round"
			});
			path.node.setAttribute("class", myObject[i].Class + " resume_node");


			// Add the circles to the array and draw them
			circles.push({"cx":coords.x_end, 
					    "cy":coords.y_end, 
					    "node_type":"job", 
					    "description":myObject[i].Company,
					    "css_class":myObject[i].Class + " resume_node",
						"css_id":"C"+i});

			// Determine the second level coordinates
			if(myObject[i].Experience != undefined) {
				// Determine the coordinate string for the second level
				second_level = 45+(50 * Math.log(myObject[i].Experience.length));
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
					coordinate_string = second_level_coords.path_string;
					var path = paper.path(coordinate_string);
					path.attr({
						stroke: path_color,
						'stroke-width': '3px',
						'stroke-linecap': "round",
						'stroke-linejoin': "round"
					});
					path.node.setAttribute("class", myObject[i].Experience[s].Class + " resume_node");

					// Add coordinates to draw circles later
					circles.push({"cx":second_level_coords.x_end, 
							    "cy":second_level_coords.y_end, 
							    "node_type":"experience", 
							    "description":myObject[i].Experience[s],
							    "css_class":myObject[i].Experience[s].Class + " resume_node",
								"css_id":"C"+i+"_E"+s});

					// Generate third level nodes
					var total = 0;
					for (var count in myObject[i].Experience[s].Skills) {
						total++;
					}
					third_level = 27+(20*Math.log(total));
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
						coordinate_string = third_level_coords.path_string;
						var path = paper.path(coordinate_string);
						path.attr({
							stroke: path_color,
							'stroke-linecap': "round",
							'stroke-linejoin': "round"
						});
						path.node.setAttribute("class", myObject[i].Experience[s].Skills[t].class + " resume_node");

						// Add coordinates to draw circles later
						circles.push({"cx":third_level_coords.x_end, 
									"cy":third_level_coords.y_end, 
									"node_type":"skill",
									"description":myObject[i].Experience[s].Skills[t].Description,
									"css_class":myObject[i].Experience[s].Skills[t].class + " resume_node",
									"css_id":"C"+i+"_E"+s+"_S"+t});

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
				third_level = 27+(20*Math.log(total));
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
					coordinate_string = third_level_coords.path_string;
					var path = paper.path(coordinate_string);
					path.attr({
						stroke: path_color,
						'stroke-linecap': "round",
						'stroke-linejoin': "round"
					});
					path.node.setAttribute("class", myObject[i].Skills[t].class + " resume_node");

					// Add coordinates to draw circles later
					circles.push({"cx":third_level_coords.x_end,
								  "cy":third_level_coords.y_end,
								  "node_type":"skill",
								  "description":myObject[i].Skills[t].Description,
								  "css_class":myObject[i].Skills[t].class + " resume_node",
								  "css_id":"C"+i+"_S"+t});

					third_angle += third_level_degrees;
				}
			}

			// Increment the angle and iteration
			angle += first_level_degrees;
			i++;
		}

		// Draw the different types of circles for each of the nodes
		for(c in circles) {
			//Draw the circles
			switch(circles[c].node_type) {
				case 'experience':
					var experience_dot = paper.circle(circles[c].cx, circles[c].cy, 8);
					experience_dot.attr({
						fill: experience_color
					});
					experience_dot.node.setAttribute("class", circles[c].css_class);
					experience_dot.node.id = circles[c].css_id;
					experience_dot.hover(function() {
						this.g = this.glow({ color:glow_color });
					}, function() {
						this.g.remove();
					});

					break;
				case 'skill':
					var skill_dot = paper.circle(circles[c].cx, circles[c].cy, 6);
					skill_dot.attr({
						fill: skill_color
					});
					skill_dot.node.setAttribute("class", circles[c].css_class);
					skill_dot.node.id = circles[c].css_id;
					skill_dot.hover(function() {
						this.g = this.glow({ color:glow_color });
					}, function() {
						this.g.remove();
					});

					break;
				default:
					var job_dot = paper.circle(circles[c].cx, circles[c].cy, 10);
					job_dot.attr({
						fill: job_color
					});
					job_dot.node.setAttribute("class", circles[c].css_class);
					job_dot.node.id = circles[c].css_id;
					job_dot.hover(function() {
						this.g = this.glow({ color:glow_color });
					}, function() {
						this.g.remove();
					});
					job_dot.node.setAttribute("title", circles[c].css_id);
			}
		}


		// Display the appropriate information when the user mouses over a node
		$('circle').mouseover(function(event) {
			// Grab the id of the node and break it out to determine which information to display
			var item_id = event.target.id;
			id_array = parse_ids(item_id);

			// Check which information was provided by the node id and display accordingly
			if((id_array['company'] != undefined) && (id_array['experience'] != undefined) && (id_array['skill'] != undefined)) {
				var comp = id_array['company'];
				var exp = id_array['experience'];
				var skill = id_array['skill'];

				var description = '<p class="title">' + myObject[comp].Experience[exp].Skills[skill].Description + '</p>';
			}
			else if((id_array['company'] != undefined) && (id_array['experience'] != undefined) && (id_array['skill'] === undefined)) {
				var comp = id_array['company'];
				var exp = id_array['experience'];

				var description = '<p class="title">' + myObject[comp].Experience[exp].Description + '</p>';
			}
			else if((id_array['company'] != undefined) && (id_array['experience'] === undefined) && (id_array['skill'] != undefined)) {
				var comp = id_array['company'];
				var skill = id_array['skill'];

				var description = '<p class="title">' +  myObject[comp].Skills[skill].Description + '</p>';
			}
			else if((id_array['company'] != undefined) && (id_array['experience'] === undefined) && (id_array['skill'] === undefined)) {
				var comp = id_array['company'];

				if(myObject[comp].School != undefined) {
					var description = '<h2>' + myObject[comp].School + '</h2>'
					description += '<p class="location">' + myObject[comp].Location + '</p>';
					description += '<p class="title">' + myObject[comp].Degree + '</p>';
					description += '<p class="dates">' + myObject[comp].Start_Date + ' - ' + myObject[comp].End_Date + '</p>';
				}
				else {
					var description = '<h2>' + myObject[comp].Company + '</h2>';
					description +='<p class="location">' + myObject[comp].Location + '</p>';
					if(myObject[comp].Title != undefined) {
						description += '<p class="title">' + myObject[comp].Title + '</p>';
					}
					description += '<p class="dates">' + myObject[comp].Start_Date + ' - ' + myObject[comp].End_Date + '</p>';
				}				
			}

			// Display the tooltips
			$( this ).qtip({ 
				content: { text: description }, 
				show: { ready: true },
				style: { classes: 'resume-tooltip' }
			});

		});

	$('#help').mouseover(function(event) {
		$( this ).qtip({
			content: { text: "Hover your mouse over the circles to get more information about my experience." },
			show: { ready: true }
		})
	});

		// Display the list of filters based on filters.json (could be pulled from DB)
		$.getJSON("filters.json", function(filter_data){
			$.each(filter_data, function() {
				$('#options ul').prepend( '<li><a href="#" class="filter_option" id="' + this.class + '">' + this.name + '</a></li>' );
			});
		});
		// Set the click handlers to fade out/in the different nodes
		$('.filter_option').live('click', function(event){
			var item = event.target.id;
			var item_class = '.' + item;
			if(item == 'all') {
				$('.resume_node').animate({
					opacity: 1
				});
				$('#description').fadeOut("slow").empty();
			}
			else {
				$('#description').fadeOut("slow", function() {
					$('#description').empty();
					$('.resume_node').animate({
						opacity: 0.05
					});
					$(item_class).animate({
						opacity: 1
					});
					$('#description').append('<h2>' + item + '</h2>').fadeIn("slow");
				});
			}
		});



		// Animate the options dropdown
		// Change the options box to the smaller size and hide the content
		$('#options').height("35px");
		$('#options ul, #options p').hide();

		var filter_count = 18;
		var filter_height = (35 + 70 + (filter_count * 20)) + "px";

		// On a click, open/close the box and display/hide the content
		$('#minimize').toggle(function() {
			$('#options').animate({
				height: filter_height
			}, 1000);
			$('#options ul, #options p').fadeIn();
			}, function() {
			$('#options').animate({
				height: "35px"
			}, 1000);
			$('#options ul, #options p').fadeOut();
		});

	});
});



// Takes an angle and determines the appropriate x/y coordinates to draw an angled line for the given angle
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

// Determines the lower and upper degree boundaries for different levels of the resume
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

// Parses the IDs from the nodes into parts that can be used to access descriptions in the resume data
function parse_ids(id_string) {
	var ids = id_string.split(/_/);

	var id_array = [];
	id_array['company'] = ids[0].substring(1);

	if(ids[1] != undefined) {
		if(ids[1].substring(0,1) == "E") {
			id_array['experience'] = ids[1].substring(1);
		}
		else {
			id_array['skill'] = ids[1].substring(1);
		}
	}

	if(ids[2] != undefined) {
		if(ids[2].substring(0,1) == "S") {
			id_array['skill'] == ids[2].substring(1);
		}		
	}

	return id_array;
};