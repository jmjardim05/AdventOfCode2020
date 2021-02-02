const readInputFile = require("../../readInput");
const initialState = readInputFile("Day 17");

class Day17Solver {
    #dimension = [];
    #searchArea = [];

    get dimension() {
        return this.#dimension;
    }
    get searchArea() {
        return this.#searchArea;
    }

    constructor(initialState) {
        let x = 0;
        let y = 0;
        const z = 0;
        const w = 0;
        this.#dimension = new Array();
        for (const cubes of initialState) {
            if (cubes !== "") {
                const cubeArr = cubes.split("");
                x = 0;
                for (const cube of cubeArr) {
                    this.#dimension.push([
                        x,
                        y,
                        z,
                        w,
                        cube
                    ]);
                    x++;
                }
                y++;
            }
        }
    }

    doCycle = (add4thDim) => {
        let newLength = 0;
        const activeCubes = this.#searchArea;
        activeCubes.forEach(cube => {
            for (let x = -1; x <= 1; x++) {
                const adjX = cube[0] + x;
                for (let y = -1; y <= 1; y++) {
                    const adjY = cube[1] + y;
                    for (let z = -1; z <= 1; z++) {
                        const adjZ = cube[2] + z;
                        if (add4thDim) {
                            for (let w = -1; w <= 1; w++) {
                                const adjW = cube[3] + w;
                                const neighbor = this.#searchArea.find(item => item[0] === adjX && item[1] === adjY &&
                                    item[2] === adjZ && item[3] === adjW);
                                if (!neighbor) {
                                    newLength = this.#searchArea.push([adjX, adjY, adjZ, adjW, "."]);
                                }
                            }
                        } else {
                            const neighbor = this.#searchArea.find(item => item[0] === adjX && item[1] === adjY && 
                                item[2] === adjZ);
                            if (!neighbor) {
                                newLength = this.#searchArea.push([adjX, adjY, adjZ, 0, "."]);
                            }
                        }
                    }
                }
            }
        });

        let newDimension = [];
        this.#searchArea.forEach((cube, index, dim) => {
            let active = 0;
            for (let x = -1; x <= 1; x++) {
                const adjX = cube[0] + x;
                for (let y = -1; y <= 1; y++) {
                    const adjY = cube[1] + y;
                    for (let z = -1; z <= 1; z++) {
                        const adjZ = cube[2] + z;
                        if (add4thDim) {
                            for (let w = -1; w <= 1; w++) {
                                if (x === 0 && y === 0 && z === 0 && w === 0) {
                                    continue;
                                }
                                const adjW = cube[3] + w;
                                const neighbor = dim.find(item => item[0] === adjX && item[1] === adjY &&
                                    item[2] === adjZ && item[3] === adjW);
                                if (neighbor) {
                                    active += neighbor[4] === "#" ? 1 : 0;
                                }
                            }
                        } else {
                            if (x === 0 && y === 0 && z === 0) {
                                continue;
                            }
                            const neighbor = dim.find(item => item[0] === adjX && item[1] === adjY && item[2] === adjZ);
                            if (neighbor) {
                                active += neighbor[4] === "#" ? 1 : 0;
                            }
                        }
                    }
                }
            }

            let newState = ".";
            if (cube[4] === "#") {
                newState = (active < 2 || active > 3) ? "." : "#";
            } else {
                newState = active !== 3 ? "." : "#";
            }

            if (newState === "#") {
                newDimension.push([cube[0], cube[1], cube[2], cube[3], newState]);
            }
        });

        return newDimension;
    }

    solveFirstPart = () => {
        this.#searchArea = this.#dimension.map(cube => [ ...cube ]);
        for (let i = 0; i < 6; i++) {
            this.#searchArea = this.doCycle(false);
        }

        return this.#searchArea.length;
    }

    solveSecondPart = () => {
        this.#searchArea = this.#dimension.map(cube => [ ...cube ]);
        for (let i = 0; i < 6; i++) {
            this.#searchArea = this.doCycle(true);
        }

        return this.#searchArea.length;
    }
}

const solver = new Day17Solver(initialState);
console.time("part 1");
console.log("\nSolution for Day 17 - First puzzle:", solver.solveFirstPart());
console.timeEnd("part 1");

console.time("part 2");
console.log("\nSolution for Day 17 - Second puzzle:", solver.solveSecondPart());
console.timeEnd("part 2");