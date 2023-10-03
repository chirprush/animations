class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Point(
            this.x + other.x,
            this.y + other.y
        );
    }

    draw() {
        push();
        fill(255);
        noStroke();

        circle(this.x, this.y, 8);
        pop();
    }
}

const randTheta = () => {
    return Math.random() * 2 * Math.PI;
};

const resetParticle = () => {
    segments = [];
};

let currentN;
let segments;
let stepsSlider;

const setup = () => {
    windowResize();

    resetParticle();

    stepsSlider = createSlider(0, 4, 0);
    currentN = 1;
    stepsSlider.position(10, 10);
    stepsSlider.style("width", "100px");
};

const draw = () => {
	background(0x28, 0x2c, 0x34);

    let radius = Math.min(2 / 5 * width, 2 / 5 * height);

    if (currentN != Math.pow(10, stepsSlider.value())) {
        currentN = Math.pow(10, stepsSlider.value());
        resetParticle();
    }

    noStroke();
    fill(255);
    textSize(20);
    text("Steps: " + currentN, 10, 60);

    let prev = new Point(width / 2, height / 2);


    for (let i = 0; i < segments.length; i++) {
        let current = prev.add(segments[i]);

        strokeWeight(1);
        stroke(0x61, 0xaf, 0xef);

        line(prev.x, prev.y, current.x, current.y);

        prev = current;
    }

    prev.draw();

    stroke(255);
    strokeWeight(3);
    noFill();

    circle(width / 2, height / 2, 2 * radius);

    if (segments.length < currentN) {
        let angle = randTheta();
        segments.push(new Point(
            radius / currentN * cos(angle),
            radius / currentN * sin(angle)
        ));
    }
};

const mouseClicked = () => {
    resetParticle();
}

const windowResize = () => {
	resizeCanvas(window.innerWidth, window.innerHeight);

	width = window.innerWidth;
	height = window.innerHeight;
};

window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;
window.windowResize = windowResize;
window.onresize = windowResize;
