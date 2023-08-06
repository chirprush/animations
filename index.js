// Guaranteed to be x in [-1, 1]
const f = (x, a) => {
    return Math.sin(a / 50) * Math.sin(2 * Math.PI * x);
};

let frames = 0;

const setup = () => {
    let canvas = document.getElementById("anim-canvas");

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    let p5Canvas = createCanvas(width, height);
    p5Canvas.parent("anim-canvas");

    windowResize();
};

const draw = () => {
	background(0x28, 0x2c, 0x34);
    noFill();

    const funcSegments = 1000;
    const padding = 5;

    let spacing = width / funcSegments;

    for (let j = 0; j < 3; ++j) {
        for (let k = 0; k < 10; ++k) {
            stroke(255, 255 - 50 * (k + 1));
            strokeWeight(Math.max(3 - k, 2));
            beginShape();

            for (let i = 0; i <= funcSegments; ++i) {
                let canvasX = i * spacing;
                let funcX = (canvasX / width - 0.5) * 2 + Math.PI * j;
                let funcY = 1 / sqrt(k + 1) * f(funcX, frames + 20 * j);
                let canvasY = height / 2 - (height - 2 * padding) / 2 * funcY;

                vertex(canvasX, canvasY);
            }

            endShape();
        }
    }

    frames++;
};

const windowResize = () => {
    let canvas = document.getElementById("anim-canvas");

	resizeCanvas(canvas.clientWidth, canvas.clientHeight);

	width = canvas.clientWidth;
	height = canvas.clientHeight;
};

window.setup = setup;
window.draw = draw;
window.windowResize = windowResize;
window.onresize = windowResize;
