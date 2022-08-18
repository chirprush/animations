class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	lerp(other, t) {
		return new Point(
			(1 - t) * this.x + t * other.x,
			(1 - t) * this.y + t * other.y,
		);
	}

	draw(alpha, r) {
		noStroke();
		fill(255, alpha);
		ellipse(this.x, this.y, r, r);
	}
}

const smooth = (t) => Math.pow(Math.sin(t * Math.PI / 2), 2);

const MAX_FRAMES = 250;

let segments = [];
let points = [];
let f = 0;

const setup = () => {
	createCanvas(window.innerWidth, window.innerHeight);

	let number = Math.floor(Math.random() * 4) + 3;

	for (let _ = 0; _ < number; _++) {
		points.push(new Point(
			Math.floor(Math.random() * window.innerWidth * 0.5) + window.innerWidth * 0.25,
			Math.floor(Math.random() * window.innerHeight * 0.5) + window.innerHeight * 0.25,
		));
	}
};

const draw = () => {
	background(0x28, 0x2c, 0x34);

	let t = smooth(f / MAX_FRAMES);

	for (let i = 0; i < segments.length - 1; i++) {
		stroke(255, 255);
		strokeWeight(5);
		line(
			segments[i].x, segments[i].y,
			segments[i + 1].x, segments[i + 1].y,
		);
	}

	let prev = points;
	let buffer = [];

	for (let _ = 0; _ < points.length - 1; _++) {
		for (let i = 0; i < prev.length - 1; i++) {
			const alpha = Math.floor((1 - t) * 200 / points.length * prev.length);
			const radius = Math.floor(15 / points.length * prev.length);

			prev[i].draw(alpha, radius);

			if (i == prev.length - 2) {
				prev[i + 1].draw(alpha, radius);
			}

			const weight = Math.ceil(6 / points.length * prev.length);

			stroke(255, Math.floor(alpha * 0.7));
			strokeWeight(weight);

			line(
				prev[i].x, prev[i].y,
				prev[i + 1].x, prev[i + 1].y
			);

			buffer.push(prev[i].lerp(prev[i + 1], t));
		}

		prev = buffer;
		buffer = [];
	}

	segments.push(prev[0]);

	f++;

	if (f > MAX_FRAMES) {
		noLoop();
	}
};

const windowResize = () => {
	resizeCanvas(window.innerWidth, window.innerHeight);
}

window.setup = setup;
window.draw = draw;
window.windowResize = windowResize;
window.onresize = windowResize;
