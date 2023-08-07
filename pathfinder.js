const canvas = document.getElementById('labyrinth');
const ctx = canvas.getContext('2d');
const cellSize = 20;

let labyrinth = generateLabyrinth(40,40);

let useDensityMode = false;

document.getElementById('toggleMode').addEventListener('click', function() {
    useDensityMode = !useDensityMode;
    if (useDensityMode) {
        this.textContent = "Switch to default mode";
        labyrinth =generateLabyrinthwithdensity(40, 40); // 0.3 is an example density
    } else {
        this.textContent = "Switch to density mode";
        labyrinth = generateLabyrinth(40, 40);
    }
    drawLabyrinth([]);
});


/*[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];*/


function clearAround(labyrinth, point) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const y = point.y + dy;
            const x = point.x + dx;
            if (y >= 0 && y < labyrinth.length && x >= 0 && x < labyrinth[y].length) {
                labyrinth[y][x] = 0;
            }
        }
    }
}


function generateLabyrinthwithdensity(rows, cols, density = 0.3) {
    const labyrinth = Array(rows).fill(null).map(() => Array(cols).fill(0));

    function inBounds(x, y) {
        return x >= 0 && x < cols && y >= 0 && y < rows;
    }

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (Math.random() < density) {
                labyrinth[y][x] = 1;
            }
        }
    }

    labyrinth[1][1] = 0;
    labyrinth[rows - 2][cols - 2] = 0;

    clearAround(labyrinth, { x: 1, y: 1 });
    clearAround(labyrinth, { x: cols - 2, y: rows - 2 });

    return labyrinth;
}


function generateLabyrinth(rows, cols) {
    const labyrinth = Array(rows).fill(null).map(() => Array(cols).fill(1));

    const FRONTIER = 2;
    const directions = [
        { x: 0, y: -2 },
        { x: 0, y: 2 },
        { x: -2, y: 0 },
        { x: 2, y: 0 }
    ];

    function inBounds(x, y) {
        return x >= 0 && x < cols && y >= 0 && y < rows;
    }

    const start = { x: 1, y: 1 };
    labyrinth[start.y][start.x] = 0;
    const frontiers = [start];

    while (frontiers.length) {
        const current = frontiers.pop();
        const x = current.x;
        const y = current.y;

        const neighbors = directions
            .map(dir => ({ x: x + dir.x, y: y + dir.y }))
            .filter(pos => inBounds(pos.x, pos.y) && labyrinth[pos.y][pos.x] === 1);

        if (neighbors.length) {
            const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            const dx = (chosen.x - x) / 2;
            const dy = (chosen.y - y) / 2;

            labyrinth[y + dy][x + dx] = 0;
            labyrinth[chosen.y][chosen.x] = 0;

            frontiers.push(chosen);
            frontiers.push(current);
        }
    }

    clearAround(labyrinth, { x: 1, y: 1 });
    clearAround(labyrinth, { x: cols - 2, y: rows - 2 });

    return labyrinth;
}




const rows = labyrinth.length;
const cols = labyrinth[0].length;

const start = { x: 1, y: 1 };
const end = { x: 38, y: 38 };

function pointKey(p) {
    return `${p.x},${p.y}`;
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function findPath(start, end) {
    let openSet = [start];
    let closedSet = [];
    let path = [];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    gScore[pointKey(start)] = 0;
    fScore[pointKey(start)] = heuristic(start, end);

    while (openSet.length > 0) {
        let current = openSet.reduce((a, b) => fScore[pointKey(a)] < fScore[pointKey(b)] ? a : b);

        if (current.x === end.x && current.y === end.y) {
            let temp = current;
            path.push(temp);
            while (cameFrom[pointKey(temp)]) {
                path.push(cameFrom[pointKey(temp)]);
                temp = cameFrom[pointKey(temp)];
            }
            return path.reverse();
        }

        openSet = openSet.filter(el => el !== current);
        closedSet.push(current);

        let neighbors = [
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 }
        ];

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= cols || neighbor.y >= rows) continue;
            if (labyrinth[neighbor.y][neighbor.x] === 1) continue;
            if (closedSet.some(el => el.x === neighbor.x && el.y === neighbor.y)) continue;

            let tentative_gScore = (gScore[pointKey(current)] || 0) + 1;
            if (openSet.every(el => el.x !== neighbor.x || el.y !== neighbor.y)) {
                openSet.push(neighbor);
            } else if (tentative_gScore >= (gScore[pointKey(neighbor)] || 0)) {
                continue;
            }

            cameFrom[pointKey(neighbor)] = current;
            gScore[pointKey(neighbor)] = tentative_gScore;
            fScore[pointKey(neighbor)] = gScore[pointKey(neighbor)] + heuristic(neighbor, end);
        }
    }

    return [];
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let cellX = Math.floor(mouseX / cellSize);
    let cellY = Math.floor(mouseY / cellSize);

    cellX = Math.max(0, Math.min(cellX, cols - 1));
    cellY = Math.max(0, Math.min(cellY, rows - 1));

    const path = findPath(start, { x: cellX, y: cellY });
    const reachedEnd = cellX === end.x && cellY === end.y;
    drawLabyrinth(path, reachedEnd);
});


function drawLabyrinth(path, reachedEnd) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (labyrinth[y][x] === 1) {
                ctx.fillStyle = '#B0A8B9'; 
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    const pathColor = reachedEnd ? '#A0DAA9' : '#A2D2FF'; 
    path.forEach(point => {
        ctx.fillStyle = pathColor;
        ctx.fillRect(point.x * cellSize, point.y * cellSize, cellSize, cellSize);
    });
    ctx.fillStyle = '#A0DAA9'; 
    ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = '#FFA69E';
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
}

drawLabyrinth([]);
ctx.fillStyle = 'green';
ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);

