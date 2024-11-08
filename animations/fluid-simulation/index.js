const colors = [
    [0x1d, 0x20, 0x21], // Gray
    [0x00, 0x50, 0xb5],
    [0x00, 0x8a, 0xd8],
    [0x19, 0xab, 0xff],
    [0x00, 0x73, 0xcf],
    // [0xdf, 0xef, 0xff]
];

const pixelSize = 10;

const deathAge = 50; // 100;
const youngMax = 5; // 5;

let w, h;
let grid;
let swapGrid;

let paddingX, paddingY;

let frame = 0;

class Cell {
    constructor(color, age) {
        this.color = color;
        this.age = age;
    }

    update() {
        // Bro it's just like me
        this.age++;
    }

    render(x, y) {
        let c = colors[this.color];
        fill(c[0], c[1], c[2], 255);
        stroke(c[0], c[1], c[2], 255);

        // Maybe change this later
        noStroke();

        rect(
            paddingX + x * pixelSize,
            paddingY + y * pixelSize,
            pixelSize,
            pixelSize
        );
    }

    copy() {
        return new Cell(this.color, this.age);
    }
}

let gridFromFunc = (f) => {
    let g = [];

    for (let y = 0; y < h; y++) {
        let row = [];

        for (let x = 0; x < w; x++) {
            row.push(new Cell(f(x, y), 0));
        }

        g.push(row);
    }

    return g;
};

let emptyGrid = () => {
    return gridFromFunc((x, y) => 0);
};

let randomGrid = () => {
    return gridFromFunc((x, y) => Math.floor(Math.random() * colors.length));
};

let winningColor = (grid, x, y) => {
    let counts = {};

    let maxCount = -1;

    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) { continue; }
            
            let y_ = (y + dy + h) % h;
            let x_ = (x + dx + w) % w;

            if (grid[y_][x_].color == 0 || grid[y_][x_].age > youngMax) { continue; }

            if (!(grid[y_][x_].color in counts)) {
                counts[grid[y_][x_].color] = 1;
            } else {
                counts[grid[y_][x_].color]++;
            }

            maxCount = Math.max(counts[grid[y_][x_].color], maxCount);
        }
    }

    if (maxCount == -1) { return grid[y][x].color; }

    let winningColors = [];

    for (let key of Object.keys(counts)) {
        if (counts[key] == maxCount) {
            winningColors.push(key);
        }
    }

    return winningColors[Math.floor(Math.random() * winningColors.length)];
};

const setup = () => {
	createCanvas(window.innerWidth, window.innerHeight);

	const width = window.innerWidth;
	const height = window.innerHeight;

    w = Math.floor(width / pixelSize);
    h = Math.floor(height / pixelSize);

    paddingX = (width - pixelSize * w) / 2;
    paddingY = (height - pixelSize * h) / 2;

    grid = randomGrid();
    swapGrid = emptyGrid();

    frameRate(30);
};

const draw = () => {
	background(colors[0][0], colors[0][1], colors[0][2]);

    // let fps = frameRate();
    // console.log(fps);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            grid[y][x].render(x, y);

            // Updating
            let win = winningColor(grid, x, y);

            if (win === grid[y][x].color) {
                swapGrid[y][x] = grid[y][x].copy();
                swapGrid[y][x].update();
            } else {
                swapGrid[y][x] = new Cell(win, 0);
            }

            if (swapGrid[y][x].age >= deathAge) {
                swapGrid[y][x] = new Cell(0, 0);
            }
        }
    }

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            grid[y][x] = swapGrid[y][x].copy();
            swapGrid[y][x] = new Cell(0, 0);
        }
    }

    frame++;

    if (frame == 1000) {
        grid = randomGrid();
        frame = 0;
    }
};

// This is kind of irksome because we have to resize the grid,
// so let's ignore it for now
const windowResize = () => {
	resizeCanvas(window.innerWidth, window.innerHeight);
};

window.setup = setup;
window.draw = draw;
window.windowResize = windowResize;
window.onresize = windowResize;
