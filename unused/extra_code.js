		// Highlight or fade certain nodes and paths based on which filter the user applies

/*		$('#javascript-filter').click(function(){
			$('.Analytics, .HTML, .Javascript, .unknown').animate({
				opacity: 0.05
			});
			$('.Javascript').animate({
				opacity: 1
			});
		});
		$('#analytics-filter').click(function(){
			$('.Analytics, .HTML, .Javascript, .unknown').animate({
				opacity: 0.05
			});
			$('.Analytics').animate({
				opacity: 1
			});
		});
		$('#html-filter').click(function(){
			$('.Analytics, .HTML, .Javascript, .unknown').animate({
				opacity: 0.05
			});
			$('.HTML').animate({
				opacity: 1
			});
		});
		$('#all-filter').click(function() {
			$('.Analytics, .HTML, .Javascript, .unknown').animate({
				opacity: 1
			});
		})
*/









/*function draw_second_layer(column_name, json_object, x_origin, y_origin, starting_angle, radius = 100, total_degrees = 180) {
	var nodes = json_object[column_name].length;

	var degrees = total_degrees/nodes;

	// Determine what needs to be done for the specific angle
	if(starting_angle > 90) {
		var measurement_angle = starting_angle % 90;
	}
	else {
		var measurement_angle = starting_angle;
	}
	var horizontal = '';
	var vertical = '';
	switch(starting_angle) {
		case (>0 && <90):
			horizontal = Math.sin(measurement_angle) * radius;
			vertical = Math.cos(measurement_angle) * radius;
			break;
		case (>90 && < 180):
			horizontal = 
			vertical = 
		default:
	}

	for(var e = 1; e < nodes; e++) {
		// Treat the first node differently than the others
		if(e == 0) {
			var y_end = y_origin + (Math.sin(measurement_angle) * radius);
			var x_end = x_origin + (Math.cos(measurement_angle) * radius);
		}
		// the nodes will fan out instead of going in a circle, check whether number is even/odd
		if(e % 2 = 0) {	// Even number, to the right of the center node
			angle = measurement_angle + degrees;
			x_end = x_origin + Math.sin(angle) * radius;
			y_end = y_origin + Math.cos(angle) * radius;
		}
		else {
			// Odd number, to the left of the center node
			angle = measurement_angle - degrees;
		}
		
		draw_experience_node();
	}

	return {"x_end":x_end, "y_end":y_end, "starting_angle":starting_angle};
}

function draw_third_layer(column_name, json_object, x_origin, y_origin, radius = 50, total_degrees = 90) {
	var nodes = json_object[column_name].length;

	var degrees = total_degrees/nodes;

	for(var e = 0; e < json_object[column_name]) {
		switch((degrees * e)) {
			case (>0 && <90): 		
				x_end = x_origin + (Math.sin(degrees * e) * radius);
				y_end = y_origin - (Math.cos(degrees * e) * radius);
				break;
			case 90: 				// Rightward straight line
				x_end = x_origin;
				y_end = y_origin - radius;
				break;
			case (>90 && <180): 	// Bottom right hand quadrant relative to the origin
				x_end = x_origin + (Math.sin(degrees * Math.floor(e/2)) * radius);
				y_end = y_origin - (Math.cos(degrees * Math.floor(e/2)) * radius);
				break;
			case 180: 				// Downward vertical line
				x_end = x_origin + radius;
				y_end = y_origin;
				break;
			case (>180 && <270): 	// Bottom left hand quadrant relative to the origin
				x_end = x_origin + (Math.sin(degrees * Math.floor(e/3)) * radius);
				y_end = y_origin - (Math.cos(degrees * Math.floor(e/3)) * radius); 
				break;
			case 270: 				// Leftward straight line
				x_end = x_origin;
				y_end = y_origin + radius;
				break;
			case (>270 && <360): 	// Top left hand quadrant relative to the origin
				x_end = x_origin - (Math.sin(degrees * Math.floor(e/4)) * radius);
				y_end = y_origin + (Math.cos(degrees * Math.floor(e/4)) * radius);
				break;
			default: 	// Default is the first left horizontal line... 0Âº
				x_end = x_origin - radius;
				y_end = y_origin;
		}
		
		draw_experience_node();
	}	
}
*/
