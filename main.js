// Author: Edward Carrasco
// Course: MATH-212-4264 Calculus II

// Implement Euler's Method. (Section 7.7)
// The program should allow the following to be easily modified: 
// - the function being integrated, 
// - the interval over which the integral is being approximated, and 
// - the number of subintervals.

var xinitial = 0;
var yinitial = 0;
var dx = 0.1;
var subintervals = 10;

var origin = {
	x: 0,
	y: 0
};
var xscale = 100; 
var yscale = 100;
var radius = 1;

var func = func1;

var isGraphing = false;
var autodraw = false;
var xautodraw = false;
var yautodraw = false;
var xmin, xmax, ymin, ymax, xdir, ydir;



function setup() {
	var canvas = createCanvas(800,600);
	canvas.parent('sketch-container');
	centerGraph();
	updateEraseButton();

	document.getElementById('button-func8').click();

	// Set up autodraw values
	xmin = document.getElementById('slider-initial-x').min * 1;
	xmax = document.getElementById('slider-initial-x').max * 1;
	ymin = document.getElementById('slider-initial-y').min * 1;
	ymax = document.getElementById('slider-initial-y').max * 1;
	xdir = document.getElementById('slider-initial-x').step * 100;
	ydir = document.getElementById('slider-initial-y').step * 100;
}

function draw() {
	if (!isGraphing) {
		background(101);	
	}
	var points = [];

	updateValues();
	updatePoints(points);

	drawGraph(points);
	//drawTable(points);

}

function turnOffMultiLine() {
	isGraphing = false;
	updateEraseButton();
}

function mouseDragged() {

	if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {

		origin.x += mouseX-pmouseX;
		origin.y -= mouseY-pmouseY;

		turnOffMultiLine();
	}
}

function updatePoints(points) {
	if (func) {
		// Initial value
		points.push({
			x: xinitial, 
			y: yinitial
		});

		// Interval values
		points.length = subintervals;
		for (var i = 1; i < points.length; i++) {
			var xprev = points[i-1].x;
			var yprev = points[i-1].y;
			points[i] = {
				x: xprev + dx,
				y: yprev + func(xprev, yprev) * dx
			}
		}
	}
}

function toggleAutodraw() {
	autodraw = !autodraw;
}

function toggleAutodrawX() {
	xautodraw = !xautodraw;
	if (xautodraw) document.getElementById('button-autodrawx').className = "autoactive";
	else document.getElementById('button-autodrawx').className = "";
}

function toggleAutodrawY() {
	yautodraw = !yautodraw;
	if (yautodraw) document.getElementById('button-autodrawy').className = "autoactive";
	else document.getElementById('button-autodrawy').className = "";
}


function updateValues() {
	if (xautodraw) {
		var x = document.getElementById('slider-initial-x').value * 1;
		if (x <= xmin) {
			xdir *= -1;
			x = xmin;
		}
		else if (x >= xmax) {
			xdir *= -1;
			x = xmax;
		}
		document.getElementById('slider-initial-x').value = x + xdir;
		document.getElementById('number-initial-x').value = x + xdir;
	}

	if (yautodraw) {
		var y = document.getElementById('slider-initial-y').value * 1;
		if (y <= ymin) {
			ydir *= -1;
			y = ymin;
		}
		else if (y >= ymax) {
			ydir *= -1;
			y = ymax;
		} 
		document.getElementById('slider-initial-y').value = y + ydir;
		document.getElementById('number-initial-y').value = y + ydir;
	}

	xinitial = document.getElementById('slider-initial-x').value * 1;
	yinitial = document.getElementById('slider-initial-y').value * 1;

	dx = document.getElementById('slider-dx').value * 1;
	subintervals = document.getElementById('slider-subintervals').value * 1;
	
	xscale = document.getElementById('slider-xscale').value * 1;
	yscale = document.getElementById('slider-yscale').value * 1;

	radius = document.getElementById('slider-point-size').value * 1;
}

function resetAll() {
	document.getElementById('button-initial-x').click();
	document.getElementById('button-initial-y').click();
	document.getElementById('button-dx').click();
	document.getElementById('button-subintervals').click();
	document.getElementById('button-xscale').click();
	document.getElementById('button-yscale').click();
	document.getElementById('button-point-size').click();
}

function drawGraph(points) {
	push();
	translate(origin.x, height-origin.y);

	// Draw the x- and y-axis
	line(-origin.x, 0,  width-origin.x, 0);	// x-axis
	line(0, origin.y,  0,-height+origin.y);	// y-axis

	// Draw some numbers
	for (var i = 1; i < 51; i++) {
		var x = i*xscale;	// Horizontal distance between each mark
		var y = -i*yscale;	// Vertical distance between each mark
		var length = 5;	// Length of the lines

		line(x, -length, x, length);	// Lines for positive x-axis
		line(-x, -length, -x, length);	// Lines for negative x-axis
		line(-length, y, length, y);	// Lines for positive y-axis
		line(-length, -y, length, -y);	// Lines for positive y-axis

		textSize( map(xscale, 1,500, 8,20) );
		textAlign(CENTER, CENTER);
		text(i, x, length+12);		// Text for positive x-axis
		text(-i, -x, length+12);	// Text for negative x-axis

		textSize( map(yscale, 1,500, 8,20) );
		textAlign(RIGHT, CENTER);
		text(i, -length-1, y);		// Text for y-axis
		text(-i, -length-1, -y);	// Text for y-axis 
	}

	// Draw the points
	fill(255,0,255);
	noStroke();
	for (var i = 0; i < points.length; i++) {
		// Note: The canvas increases the y-axis downwards. To have it increase upwards, multiply y by -1

		ellipse(points[i].x*xscale, -1*points[i].y*yscale, radius);
	}
	pop();
}

function drawTable(points) {
	// Draw the values of the points
	push();
	var xoffset = width - 150;
	var yoffset = 12;
	fill(255)
	text("n", xoffset, yoffset);
	text("x", xoffset+40, yoffset);
	text("y", xoffset+100, yoffset);
	yoffset += 20;
	for (var i = 0; i < points.length; i++) {
		var str = i + "     " +  + "     y = " + points[i].y.toFixed(3);
		text(i, xoffset, yoffset);
		text(points[i].x.toFixed(3), xoffset+40, yoffset)
		text(points[i].y.toFixed(3), xoffset+100, yoffset)
		yoffset += 20;
	}
	pop();
}

function toggleGraphing() {
	isGraphing = !isGraphing;
	updateEraseButton();
}

function updateEraseButton() {
	if (isGraphing) document.getElementById('button-eraser').className = "multiActive";
	else document.getElementById('button-eraser').className = "";
}

function centerGraph() {
	origin.x = width*0.5; 
	origin.y = height*0.5;
}

function buttonActive(button, str_class) {
	var activeButtons = document.querySelectorAll('.'+str_class);
	for (var i = 0; i < activeButtons.length; i++) {
		activeButtons[i].className = "";
	}
	button.className = str_class;
}

// Math Functions

function func0(x,y) {
	return 1;
}

function func1(x,y) {
	return 1/y;
}

function func2(x,y) {
	return 1/x;
}

function func3(x,y) {
	return y - x;
}

function func4(x,y) {
	return -x/y;
}

function func5(x,y) {
	return pow(y,1/3);
}

function func6(x,y) {
	return pow(y,2) - 1;
}

function func7(x,y) {
	return (x+y)/(x-y);
}

function func8(x,y) {
	return sin(x) * sin(y);
}

function func9(x,y) {
	return pow(x,2) - pow(y,2);
}
