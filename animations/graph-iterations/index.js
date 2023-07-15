const smooth = (t) => Math.pow(Math.sin(Math.PI / 2 * t), 2);

class Edge {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

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

    sub(other) {
        return new Point(
            this.x - other.x,
            this.y - other.y
        );
    }

    mult(t) {
        return new Point(
            this.x * t,
            this.y * t
        );
    }
}

class State {
    static EdgeDrawing = new State("edge", 20);
    static VertexAdding = new State("vertex", 60);

    constructor(name, frameLength) {
        this.name = name;
        this.frameLength = frameLength;
    }
}

// A bijection from the natural numbers (specifically [0, n(n-1)/2 - 1]) to all
// pairs representing edges on a graph with n-vertices. I figured this would be
// more efficient, especially so than generating all the edges, but it perhaps
// does suffer in terms of readability.
const edgeBijection = (n, i) => {
    const j = n * (n - 1) / 2 - i;
    const x = Math.floor((n - 1) - 1 / 2 * (Math.sqrt(1 + 8 * j) - 1));
    const y = x + 1 + i - 1 / 2 * x * (2 * n - 1 - x);
    return new Edge(x, y);
};

let trueVertices = 3;
let vertices = 3;
let adjacencyState = 1;
let angle = 0;
let animState = State.EdgeDrawing;
let frame = 0;
let previousBits = [];

const setup = () => {
    windowResize();
};

const draw = () => {
	background(0x28, 0x2c, 0x34);
    translate(width / 2, height / 2);

    let smaller = Math.min(width, height);
    let radius = smaller / 3;

    noFill();
    stroke(255, 35);
    strokeWeight(4);
    circle(0, 0, 2 * radius);

    fill(255);
    noStroke();

    let t = smooth(frame / animState.frameLength);

    let points = [];

    let dAngle = 2 * Math.PI / vertices;
    for (let i = 0; i < vertices; ++i) {
        points.push(new Point(radius * Math.cos(dAngle * i + angle), radius * Math.sin(dAngle * i + angle)));
    }

    let newBits = [];

    if (animState === State.VertexAdding) {
        vertices = trueVertices + t;
    } else {
        push();
        // stroke(255, 80 * smooth(frame / animState.frameLength * 2));
        let leftover = [];
        for (let e = 0; e < trueVertices * (trueVertices - 1) / 2; ++e) {
            let bit = (adjacencyState >> e) % 2;
            if (!bit && !previousBits.includes(e)) { 
                continue;
            }

            let edge = edgeBijection(trueVertices, e);

            let start = points[edge.start];
            let trueEnd = points[edge.end];

            stroke(255, 80);
            if (previousBits.includes(e)) {
                if (!bit) {
                    stroke(255, 80 * (1 - smooth(Math.min(2 * frame / animState.frameLength, 1))));
                }
                line(start.x, start.y, trueEnd.x, trueEnd.y);
            } else {
                let end = trueEnd.sub(start).mult(t).add(start);

                line(start.x, start.y, end.x, end.y);
            }

            if (bit) {
                newBits.push(e);
            }
        }
        pop();

    }

    for (let p of points) {
        circle(p.x, p.y, 10);
    }

    angle -= 0.01;

    frame += 1;

    if (frame > animState.frameLength) {
        frame = 0;

        if (animState === State.EdgeDrawing) {
            previousBits = newBits;
            adjacencyState += 1;
            if (Math.floor(Math.log2(adjacencyState)) === trueVertices * (trueVertices - 1) / 2) {
                adjacencyState = 1;
                animState = State.VertexAdding;
            }
        } else {
            animState = State.EdgeDrawing;

            trueVertices += 1;
            previousBits = [];
        }
    }
};

const windowResize = () => {
	resizeCanvas(window.innerWidth, window.innerHeight);

	width = window.innerWidth;
	height = window.innerHeight;
};

window.setup = setup;
window.draw = draw;
window.windowResize = windowResize;
window.onresize = windowResize;
