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

	lineTo(other) {
		line(
			this.x, this.y,
			other.x, other.y
		);
	}

	draw(alpha, r) {
		noStroke();
		fill(255, alpha);
		ellipse(this.x, this.y, r, r);
	}
}

const smooth = (t) => 0.5 * (Math.sin(2 * t * Math.PI / 2 - Math.PI / 2) + 1);

const CURVE_FRAMES = 175;
const MOVE_FRAMES = 50;

const CURVE_STATE = 0;
const MOVE_STATE = 1;

let state = CURVE_STATE;

let segments = [];
let points = [];
let swapPoints = [];
let f = 0;

const setup = () => {
	createCanvas(window.innerWidth, window.innerHeight);

	const width = window.innerWidth;
	const height = window.innerHeight;

	let n = Math.floor(Math.random() * 6) + 3;
	points = newPoints(n);
};

const newPoints = (n) => {
	let p = [];
	let pad = 50;

	for (let _ = 0; _ < n; _++) {
		p.push(new Point(
			Math.floor(Math.random() * (width - 2 * pad)) + pad,
			Math.floor(Math.random() * (height - 2 * pad)) + pad,
		));
	}

	return p;
}

const draw = () => {
	background(0x28, 0x2c, 0x34);

	if (state === CURVE_STATE) {
		let t = smooth(f / CURVE_FRAMES);
		drawCurve(t);
	} else if (state === MOVE_STATE) {
		let t = smooth(f / MOVE_FRAMES);
		drawMove(t);
	}

	f++;

	if (state === CURVE_STATE && f > CURVE_FRAMES) {
		state = MOVE_STATE;
		f = 0;
		swapPoints = newPoints(points.length);
	} else if (state === MOVE_STATE && f > MOVE_FRAMES) {
		state = CURVE_STATE;
		f = 0;
		segments = [];
		points = swapPoints;
		swapPoints = [];
	}
};

const drawCurve = (t) => {
	stroke(255, 255);
	strokeWeight(5);

	for (let i = 0; i < segments.length - 1; i++) {
		segments[i].lineTo(segments[i + 1]);
	}

	for (let p of points) {
		p.draw(255, 15);
	}

	let prev = points;
	let buffer = [];

	for (let _ = 0; _ < points.length - 1; _++) {
		for (let i = 0; i < prev.length - 1; i++) {
			stroke(255, Math.floor(64 / points.length * prev.length * (1 - t)));
			prev[i].lineTo(prev[i + 1]);

			buffer.push(prev[i].lerp(prev[i + 1], t));
		}

		const alpha = Math.floor(127 / points.length * prev.length);
		const radius = Math.floor(15 / points.length * prev.length);

		for (let p of prev) {
			p.draw(alpha, radius);
		}

		prev = buffer;
		buffer = [];
	}
	
	segments.push(prev[0]);
};

const drawMove = (t) => {
	let inter = [];
	for (let i = 0; i < points.length; i++) {
		let p = points[i].lerp(swapPoints[i], t);
		inter.push(p);
		p.draw(255, 15);
	}

	stroke(255, 64 * t);
	for (let i = 0; i < inter.length - 1; i++) {
		inter[i].lineTo(inter[i + 1]);
	}

	stroke(255);
	let length = segments.length - 1 - Math.floor((segments.length - 1) * t);
	for (let i = 0; i < length; i++) {
		segments[i].lineTo(segments[i + 1]);
	}
};

const windowResize = () => {
	resizeCanvas(window.innerWidth, window.innerHeight);
};

window.setup = setup;
window.draw = draw;
window.windowResize = windowResize;
window.onresize = windowResize;
