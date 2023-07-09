let width;
let height;

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    mult(k) {
        return new Vec2(this.x * k, this.y * k);
    }
}

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(other) {
        return new Vec3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
        );
    }

    sub(other) {
        return new Vec3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z
        );
    }

    mult(k) {
        return new Vec3(
            k * this.x,
            k * this.y,
            k * this.z
        );
    }

    div(k) {
        return new Vec3(
            this.x / k,
            this.y / k,
            this.z / k
        );
    }

    rotateX(theta) {
        return new Vec3(
            this.x,
            this.y * Math.cos(theta) - this.z * Math.sin(theta),
            this.y * Math.sin(theta) + this.z * Math.cos(theta)
        );
    }

    rotateY(theta) {
        return new Vec3(
            this.x * Math.cos(theta) + this.z * Math.sin(theta),
            this.y,
            -this.x * Math.sin(theta) + this.z * Math.cos(theta)
        );
    }

    rotateZ(theta) {
        return new Vec3(
            this.x * Math.cos(theta) - this.y * Math.sin(theta),
            this.x * Math.sin(theta) + this.y * Math.cos(theta),
            this.z
        );
    }
    
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    normalize() {
        return this.div(this.length());
    }

    toScreenVec2() {
        // Rendering canvases on computers flip the y direction.
        return new Vec2(this.x, -this.y);
    }
}

class Vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(other) {
        return new Vec4(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z,
            this.w + other.w
        );
    }

    sub(other) {
        return new Vec4(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z,
            this.w - other.w
        );
    }

    mult(k) {
        return new Vec4(
            k * this.x,
            k * this.y,
            k * this.z,
            k * this.w
        );
    }

    div(k) {
        return new Vec4(
            this.x / k,
            this.y / k,
            this.z / k,
            this.w / k
        );
    }

    rotateXY(theta) {
        return new Vec4(
            this.x * Math.cos(theta) + this.y * Math.sin(theta),
            -this.x * Math.sin(theta) + this.y * Math.cos(theta),
            this.z,
            this.w
        );
    }

    rotateXZ(theta) {
        return new Vec4(
            this.x * Math.cos(theta) - this.z * Math.sin(theta),
            this.y,
            this.x * Math.sin(theta) + this.z * Math.cos(theta),
            this.w
        );
    }

    rotateXW(theta) {
        return new Vec4(
            this.x * Math.cos(theta) + this.w * Math.sin(theta),
            this.y,
            this.z,
            -this.x * Math.sin(theta) + this.w * Math.cos(theta)
        );
    }

    rotateYZ(theta) {
        return new Vec4(
            this.x,
            this.y * Math.cos(theta) + this.z * Math.sin(theta),
            -this.y * Math.sin(theta) + this.z * Math.cos(theta),
            this.w
        );
    }

    rotateYW(theta) {
        return new Vec4(
            this.x,
            this.y * Math.cos(theta) - this.w * Math.sin(theta),
            this.z,
            this.y * Math.sin(theta) + this.w * Math.cos(theta)
        );
    }

    rotateZW(theta) {
        return new Vec4(
            this.x,
            this.y,
            this.z * Math.cos(theta) - this.w * Math.sin(theta),
            this.z * Math.sin(theta) + this.w * Math.cos(theta)
        );
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
    }

    normalize() {
        return this.div(this.length());
    }

    toVec3() {
        return new Vec3(this.x, this.y, this.z);
    }
}

class Edge {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

class Simplex3 {
    constructor() {
        this.vertices = [
            new Vec3(0, 0, 0),
            new Vec3(1, 0, 0),
            new Vec3(0, 1, 0),
            new Vec3(0, 0, 1)
        ].map(vertex => vertex.add(new Vec3(-1/2, -1/2, -1/2)));

        this.edges = [];

        for (let i = 0; i < this.vertices.length; ++i) {
            for (let j = i + 1; j < this.vertices.length; ++j) {
                this.edges.push(new Edge(i, j));
            }
        }
    }

    rotateX(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateX(theta);
        }

        return this;
    }

    rotateY(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateY(theta);
        }

        return this;
    }

    rotateZ(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateZ(theta);
        }

        return this;
    }
}

class Simplex4 {
    constructor() {
        this.vertices = [
            new Vec4(0, 0, 0, 0),
            new Vec4(1, 0, 0, 0),
            new Vec4(0, 1, 0, 0),
            new Vec4(0, 0, 1, 0),
            new Vec4(0, 0, 0, 1),
        ].map(vertex => vertex.add(new Vec4(-1/2, -1/2, -1/2, -1/2)));

        this.edges = [];

        for (let i = 0; i < this.vertices.length; ++i) {
            for (let j = i + 1; j < this.vertices.length; ++j) {
                this.edges.push(new Edge(i, j));
            }
        }
    }

    rotateXY(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateXY(theta);
        }

        return this;
    }

    rotateXZ(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateXZ(theta);
        }

        return this;
    }

    rotateXW(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateXW(theta);
        }

        return this;
    }

    rotateYZ(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateYZ(theta);
        }

        return this;
    }

    rotateYW(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateYW(theta);
        }

        return this;
    }

    rotateZW(theta) {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i] = this.vertices[i].rotateZW(theta);
        }

        return this;
    }
}

class Projection {
    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }

    scale(k) {
        this.vertices = this.vertices.map(vertex => vertex.mult(k));
    }

    render() {
        this.vertices.forEach(vertex => {
            circle(vertex.x, vertex.y, 10);
        });

        this.edges.forEach(edge => {
            let start = this.vertices[edge.start];
            let end = this.vertices[edge.end];
            line(start.x, start.y, end.x, end.y);
        });
    }
}

const project3to2 = (camera, planeCoord, object) => {
    let vertices = object.vertices.map(vertex => {
        let direction = vertex.sub(camera).normalize();
        let t = (planeCoord - camera.z) / direction.z;
        let image = direction.mult(t).add(camera);
        return image.toScreenVec2();
    });
    let edges = object.edges;

    return new Projection(vertices, edges);
};

const project4to3 = (camera, planeCoord, object) => {
    let vertices = object.vertices.map(vertex => {
        let direction = vertex.sub(camera).normalize();
        let t = (planeCoord - camera.w) / direction.w;
        let image = direction.mult(t).add(camera);
        return image.toVec3();
    });
    let edges = object.edges;

    return new Projection(vertices, edges);
};

let simplex3;
let camera3Pos;

let simplex4;
let camera4Pos;

let planeCoord;

let projectionSimplex3;
let projectionSimplex4;

let simplex3RotationToggles = [true, false, true];
let simplex4RotationToggles = [false, false, true, false, true, true];

let simplex3RotationButtons;
let simplex4RotationButtons;

const setup = () => {
	createCanvas(window.innerWidth, window.innerHeight);

	width = window.innerWidth;
	height = window.innerHeight;

    simplex3 = new Simplex3();
    camera3Pos = new Vec3(0, 0, -2);

    simplex4 = new Simplex4();
    camera4Pos = new Vec4(0, 0, 0, -2);

    planeCoord = -1;

    projectionSimplex3 = project3to2(camera3Pos, planeCoord, simplex3);
    // Make sure this works for mobile in just a little bit, all right?
    projectionSimplex3.scale(Math.min(width, height) / 2);

    let intermediate = project4to3(camera4Pos, planeCoord, simplex4);
    projectionSimplex4 = project3to2(camera3Pos, planeCoord, intermediate);
    projectionSimplex4.scale(1.7 * Math.min(width, height) / 2);

    simplex3RotationButtons = ["X", "Y", "Z"].map((rot, i) => {
        let button = createButton("Rotate " + rot);
        button.addClass("rotation-button");
        if (simplex3RotationToggles[i]) {
            button.addClass("button-on");
        }
        button.mousePressed(() => {
            simplex3RotationToggles[i] = !simplex3RotationToggles[i];
            button.toggleClass("button-on");
        });
        return button;
    });

    simplex4RotationButtons = ["XY", "XZ", "XW", "YZ", "YW", "ZW"].map((rot, i) => {
        let button = createButton("Rotate " + rot);
        button.addClass("rotation-button");
        if (simplex4RotationToggles[i]) {
            button.addClass("button-on");
        }
        button.mousePressed(() => {
            simplex4RotationToggles[i] = !simplex4RotationToggles[i];
            button.toggleClass("button-on");
        });
        return button;
    });

};

const draw = () => {
	background(0x28, 0x2c, 0x34);

    stroke(255);
    strokeWeight(2);
    fill(255);

    const smallDim = Math.min(width, height);
    const bigDim = Math.max(width, height);

    translate(bigDim / 4, smallDim / 2);
    projectionSimplex3.render();

    if (bigDim === width) {
        simplex3RotationButtons.forEach((button, i) => {
            button.position(
                bigDim / 4 + 90 * (i - 1) - 50,
                smallDim / 2 + 200
            );
        });
    } else {
        simplex3RotationButtons.forEach((button, i) => {
            button.position(
                width / 2 + (i - 1) * 100 - 35,
                smallDim / 2 + 160
            );
        });
    }

    if (bigDim === width) {
        translate(bigDim / 2, 0);

        simplex4RotationButtons.forEach((button, i) => {
            button.position(
                3 * bigDim / 4 + 90 * (i % 3 - 1) - 40,
                smallDim / 2 + 200 + Math.floor(i / 3) * 40
            );
        });
    } else {
        translate(0, 4 * bigDim / 10);

        simplex4RotationButtons.forEach((button, i) => {
            button.position(
                smallDim / 2 + 80 * (i % 3 - 1) - 40,
                13 * bigDim / 20 + 160 + Math.floor(i / 3) * 40
            );
        });
    }
    projectionSimplex4.render();

    // Not sure if there's a better way to do this unfortunately.
    if (simplex3RotationToggles[0]) {
        simplex3.rotateX(Math.PI / 180);
    }
    if (simplex3RotationToggles[1]) {
        simplex3.rotateY(Math.PI / 180);
    }
    if (simplex3RotationToggles[2]) {
        simplex3.rotateZ(Math.PI / 180);
    }

    projectionSimplex3 = project3to2(camera3Pos, planeCoord, simplex3);
    projectionSimplex3.scale(smallDim / 2);

    if (simplex4RotationToggles[0]) {
        simplex4.rotateXY(Math.PI / 180);
    }
    if (simplex4RotationToggles[1]) {
        simplex4.rotateXZ(Math.PI / 180);
    }
    if (simplex4RotationToggles[2]) {
        simplex4.rotateXW(Math.PI / 180);
    }
    if (simplex4RotationToggles[3]) {
        simplex4.rotateYZ(Math.PI / 180);
    }
    if (simplex4RotationToggles[4]) {
        simplex4.rotateYW(Math.PI / 180);
    }
    if (simplex4RotationToggles[5]) {
        simplex4.rotateZW(Math.PI / 180);
    }

    let intermediate = project4to3(camera4Pos, planeCoord, simplex4);
    projectionSimplex4 = project3to2(camera3Pos, planeCoord, intermediate);

    // I'm not entirely sure as to why the scalings are different, but I assume
    // projecting twice certainly does scale the image down (by how much is
    // perhaps a question for another time), so we do have to make the scaling
    // here a bit larger.
    projectionSimplex4.scale(1.7 * smallDim / 2);
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
