class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

let circlePoints = [];
let cosPoints = [];
let sinPoints = [];

const frequency = 3;
const angleSpeed = 0.1;

let angle = 0;

window.setup = () => {
	createCanvas(window.innerWidth, window.innerHeight);
	angleMode(RADIANS);
};

window.draw = () => {
	background(0x28, 0x2c, 0x34);

	const padding = width / 20;
	const diameter = Math.max(width, height) / 6;
	const radius = diameter / 2;

	const circleX = padding + radius;
	const circleY = padding + radius;

	const cosValue = radius * cos(angle);
	const sinValue = radius * sin(angle); 

	const pointX = cosValue + circleX;
	const pointY = sinValue + circleY;

	const cosStart = circleY + radius + 100;
	const sinStart = circleX + radius + 100;

	circlePoints.push(new Point(pointX, pointY));
	cosPoints.push(new Point(pointX, cosStart));
	sinPoints.push(new Point(sinStart, pointY));

	if (circlePoints.length > 2 * Math.PI / angleSpeed * 0.8) {
		circlePoints.shift();
	}

	if (cosPoints.length > 500) {
		cosPoints.shift();
	}

	if (sinPoints.length > 500) {
		sinPoints.shift();
	}

	noFill();
	strokeWeight(3);
	stroke(0x61, 0xaf, 0xef, 200);
	// line(circleX - radius, circleY, circleX + radius, circleY);
	line(circleX, circleY, pointX, circleY);
	stroke(0xe0, 0x6c, 0x75, 200);
	// line(circleX, circleY - radius, circleX, circleY + radius);
	line(pointX, circleY, pointX, pointY);

	noFill();
	stroke(0xc6, 0x78, 0xdd);
	strokeWeight(4);
	line(circleX, circleY, pointX, pointY);

	fill(255);
	noStroke();
	ellipse(circleX, circleY, 12, 12);
	ellipse(pointX, pointY, 12, 12);

	noFill();
	strokeWeight(4);
	stroke(0x61, 0xaf, 0xef);
	beginShape();
	cosPoints.forEach(point => vertex(point.x, point.y));
	endShape();

	stroke(0xe0, 0x6c, 0x75);
	beginShape();
	sinPoints.forEach(point => vertex(point.x, point.y));
	endShape();

	strokeWeight(4);
	for (let i = 0; i < circlePoints.length - 1; i++) {
		let alpha = 255 * Math.pow(i / circlePoints.length, 2);
		stroke(255, alpha);
		line(
			circlePoints[i].x, circlePoints[i].y,
			circlePoints[i + 1].x, circlePoints[i + 1].y
		);
	}

	cosPoints.forEach(v => v.y += frequency);
	sinPoints.forEach(v => v.x += frequency);

	fill(255);
	noStroke();
	// This doesn't scale well
	// textSize(30);
	// text(`Angle: ${-angle.toFixed(1)}`, circleX + radius + 150, circleY + radius + 150);
	// text(`Cos: ${(cosValue / radius).toFixed(2)}`, circleX + radius + 150, circleY + radius + 200);
	// text(`Sin: ${(sinValue / radius).toFixed(2)}`, circleX + radius + 150, circleY + radius + 250);

	angle += -angleSpeed;
};

window.windowResize = () => {
	resizeCanvas(window.innerWidth, window.innerHeight);
}

window.onresize = window.windowResize;
