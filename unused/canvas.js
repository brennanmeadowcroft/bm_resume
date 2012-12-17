window.onLoad = function() { init(); }

function init() {
	const title = '30pt Calibri';
	const big_font = '18pt Calibri';
	const small_font = '14pt Calibri';

	var a_canvas = document.getElementById("myCanvas");
	var context = a_canvas.getContext("2d");

	var starting_x = 250;
	var starting_y = 250;

	title_text()
	connector_line(starting_x, starting_y, 250, 200, context);
	connector_line(starting_x, starting_y, 300, 250, context);
	connector_line(starting_x, starting_y, 250, 300, context);
	connector_line(starting_x, starting_y, 200, 250, context);
	job_circle(250, 210, context);
	big_event_text(50, 50, 'Hello World!', context);
}

function job_circle(x_coord, y_coord, context) {
	var radius = 15;

	context.beginPath();
	context.arc(x_coord, y_coord, radius, 0, 2 * Math.PI, false);
	context.fillStyle = 'green';
	context.fill();
	context.lineWidth = 2;
	context.strokeStyle = '#000000';
	context.stroke();
}

function connector_line(start_x, start_y, end_x, end_y, context) {
	context.beginPath();
	context.moveTo(start_x, start_y);
	context.lineTo(end_x, end_y);
	context.stroke();
}

function title_text(x_coord, y_coord, context) {
	context.font = title;
	context.fillText('Brennan Meadowcroft', x_coord, y_coord);
	context.textAlign
}

function big_event_text(x_coord, y_coord, text, context) {
	context.font = 'italic 14pt Calibri';
	context.fillText(text, x_coord, y_coord);
}
function small_event_text(x_coord, y_coord, text, context) {
	context.font = '14pt Calibri';
	context.fillText(text, x_coord, y_coord)
}
function skill_text(x_coord, y_coord, text, context) {
	context.font = '14pt Calibri';
	context.fillText(text, x_coord, y_coord);
}
function experience_text(x_coord, y_coord, text, context) {
	context.font = '14pt Calibri';
	context.fillText(text, x_coord, y_coord);
}

init();