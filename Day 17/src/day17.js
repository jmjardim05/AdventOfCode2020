/*
    ****** Advent Of Code 2020 ******

    Solution for day 17
    https://adventofcode.com/2020/day/17

    Author: João Marcos Jardim
*/

const readInputFile = require("../../readInput");
const initialState = readInputFile("Day 17");

/*
    Algorithm for Day 17 - First puzzle

    1. check the boundaries, any active cube makes the dimesion larger for searching
        ex: if in the lowest y coord there's an active cube then increase the verification area in y (going up)
            if in the last x coord there's an active cube then increase the verification area in x (going right)
            if in any x or y coord in the most back z coord ther's an active cube, then increase the verification area in z (going backwards, negative z)
    2. insert cubes in the new array on the undefined spaces    
    3. loop x, then y and then z
        check all neighbors (we have 26 iterations total for each)
        1. if current cube is active and total adjacent cubes are 2 or 3, keep it active, else inactivate it
        2. if current cube is inactive and total adjacent cubes are 3, activate it, else keep it inactive
    4. repeat six times creating a new expanded array every iteration
*/

class Day17Solver {
    #dimension = [];
    #searchArea = [];

    get dimension() { return this.#dimension; }
    get searchArea() { return this.#searchArea; }

    constructor(initialState) {        
        let x = 0;
        let y = 0;
        const z = 0;
        this.#dimension = new Array(initialState.length - 1); //x
        for (let i = 0; i < this.#dimension.length; i++) {
            this.#dimension[i] = new Array(initialState[i].length);
            for (let j = 0; j < this.#dimension[i].length; j++) {
                this.#dimension[i][j] = new Array();
            }
        }       
        for (const cubes of initialState) {
            if (cubes !== "") {
                const cubeArr = cubes.split("");
                x = 0;                
                for (const cube of cubeArr) {                                        
                    this.#dimension[x][y][z] = cube;
                    x++;
                }
                y++;
            }
        }
        //this.#searchArea = this.expandSearchArea(this.#dimension);
    }

    // check and expands area to search for the next cycle
    expandSearchArea = currentArea => {
        let addLeft = false,
            addRight = false,
            addTop = false,
            addBottom = false,
            addFront = false,
            addBack = false;
        for (let x = 0; x < currentArea.length; x++) {
            for (let y = 0; y < currentArea[x].length; y++) {
                for (let z = 0; z < currentArea[x][y].length; z++) {
                    // check to expand x coordinate
                    if (x === 0 && currentArea[x][y][z] === "#") {
                        addLeft = true;
                    } else if (x === currentArea.length - 1 && currentArea[x][y][z] === "#") {
                        addRight = true;
                    }
                    // check to expand y coordinate
                    if (y === 0 && currentArea[x][y][z] === "#") {
                        addTop = true;
                    } else if (y === currentArea[x].length - 1 && currentArea[x][y][z] === "#") {
                        addBottom = true;
                    }
                    // check to expand z coordinate
                    if (currentArea[x][y][z] === "#" && currentArea[x][y].length === 1) {
                        addFront = true;
                        addBack = true;
                    } else if (z === 0 && currentArea[x][y][z] === "#") {
                        addBack = true;
                    } else if (z === currentArea[x][y].length - 1 && currentArea[x][y][z] === "#") {
                        addFront = true;
                    }
                }
            }
        }

        // get boundaries for copyng the current area into new search area
        const startX = addLeft ? 1 : 0;
        const startY = addTop ? 1 : 0;
        const endX = startX + currentArea.length - (addRight ? 1 : 0);
        const endY = startY + currentArea[0].length - (addBottom ? 1 : 0);
        const startZ = addBack ? 1 : 0;
        const endZ = startZ + currentArea[0][0].length - (addFront ? 1 : 0);

        // initialize searchArea
        this.#searchArea = new Array(currentArea.length + (addLeft ? 1 : 0) + (addRight ? 1 : 0));
        for (let i = 0; i < this.#searchArea.length; i++) {
            this.#searchArea[i] = new Array(currentArea[startX].length  + (addTop ? 1 : 0) + (addBottom ? 1 : 0));
            for (let j = 0; j < this.#searchArea[i].length; j++) {
                this.#searchArea[i][j] = new Array(currentArea[startX][startY].length + (addBack ? 1 : 0) + (addFront ? 1 : 0));
            }
        } 

        // create new search area by filling empty with inactive cubes, and inserting the current area
        for (let x = 0; x < this.#searchArea.length; x++) {
            for (let y = 0; y < this.#searchArea[x].length; y++) {
                for (let z = 0; z < this.#searchArea[x][y].length; z++) {
                    if (z < startZ || z > endZ) {
                        this.#searchArea[x][y][z] = ".";
                    } else {
                        if (x < startX || x > endX) {
                            this.#searchArea[x][y][z] = ".";
                        } else if (y < startY || y > endY) {
                            this.#searchArea[x][y][z] = ".";
                        } else {
                            this.#searchArea[x][y][z] = currentArea[x - startX][y - startY][z - startZ];
                        }
                    }
                }
            }
        }

        return this.#searchArea;
    }

    // this is Day11's checkDirection() plus a dimension
    #checkDirection = (x, y, z, i) => {
        /* *** SAME Z *** */
        if (x === 0 && y === -i && z === 0) {
            return 0; // up
        } else if (x === 0 && y === +i && z === 0) {
            return 1; // down
        } else if (x === -i && y === 0 && z === 0) {
            return 2; // left
        } else if (x === +i && y === 0 && z === 0) {
            return 3; // right    
        } else if (x === -i && y === -i && z === 0) {
            return 4; // up-left
        } else if (x === -i && y === +i && z === 0) {
            return 5; // down-left
        } else if (x === +i && y === -i && z === 0) {
            return 6; // up-right
        } else if (x === +i && y === +i && z === 0) {
            return 7; // down-right
        
            /* *** IN THE BACK *** */
        } else if (x === 0 && y === -i && z === -1) {
            return 8; // up
        } else if (x === 0 && y === +i && z === -1) {
            return 9; // down
        } else if (x === -i && y === 0 && z === -1) {
            return 10; // left
        } else if (x === +i && y === 0 && z === -1) {
            return 11; // right    
        } else if (x === -i && y === -i && z === -1) {
            return 12; // up-left
        } else if (x === -i && y === +i && z === -1) {
            return 13; // down-left
        } else if (x === +i && y === -i && z === -1) {
            return 14; // up-right
        } else if (x === +i && y === +i && z === -1) {
            return 15; // down-right
        
            /* *** IN FRONT *** */    
        } else if (x === 0 && y === -i && z === 1) {
            return 16; // up
        } else if (x === 0 && y === +i && z === 1) {
            return 17; // down
        } else if (x === -i && y === 0 && z === 1) {
            return 18; // left
        } else if (x === +i && y === 0 && z === 1) {
            return 19; // right    
        } else if (x === -i && y === -i && z === 1) {
            return 20; // up-left
        } else if (x === -i && y === +i && z === 1) {
            return 21; // down-left
        } else if (x === +i && y === -i && z === 1) {
            return 22; // up-right
        } else if (x === +i && y === +i && z === 1) {
            return 23; // down-right
        
            /* *** SAME X,Y AS CURRENT *** */    
        } else if (x === 0 && y === 0 && z === -1) {
            return 24; // back
        } else if (x === 0 && y === 0 && z === 1) {
            return 25; // front
        } else {
            return -1; // invalid direction
        }
    }

    // we're going to modify Day 11's checkSeats() as is a similar algorithm adding one dimension
    checkCubes = (cube, coord) => {
        let active = 0;
        let inactive = 0;
    
        // now with the addition of one more dimension we have to take more directions into account
        // considering the z coordinate
        //
        // same z      : up, down, left, right, up-left, down-left, up-right, down-right, 
        // in front    : up, down, left, right, up-left, down-left, up-right, down-right,
        // in the back : up, down, left, right, up-left, down-left, up-right, down-right,
        // same x,y as current cube: front, back 
        let directions = [false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false];

        let max = 2;
        // if (adjacent > 0) {
        //     max = adjacent + 1;
        // } else {
        //     max = this.#searchArea.length > this.#searchArea[0].length ? this.#searchArea.length : this.#searchArea[0].length;
        // }
        for (let i = 1; i < max; i++) {
            for (let x = -i; x <= i; x += i) {
                for (let y = -i; y <= i; y += i) {
                    for (let z = -1; z <= i; z += i) {
                        const adjX = coord[0] + x;
                        const adjY = coord[1] + y;
                        const adjZ = coord[2] + z;

                        if (adjX === coord[0] && adjY === coord[1] && adjZ === coord[2]) {
                            continue; // do not check actual position
                        }

                        // flags directions true by out of bounds
                        this.#checkOutOfBounds(coord, directions, adjX, adjY, adjZ, x, y, z);

                        // do not look further after finding a cube in the direction
                        const direction = this.#checkDirection(x, y, z, i);
                        if (directions[direction]) {
                            continue;
                        }

                        // if (this.#searchArea[adjX][adjY][adjZ] !== ".") {
                            switch (this.#searchArea[adjX][adjY][adjZ]) {
                                case "#": active++; break;
                                case ".": inactive++; break;
                            }

                            // flags true depending on which direction we are facing
                            directions[direction] = true;
                        // } else if (adjacent > 0 && i === adjacent) {
                        //     directions[direction] = true;    
                        // }
                    }
                }
                
                // return after finding a cube or reach the limit in all 26 directions
                if (directions.every(found => found)) {
                    if (cube === ".") {
                        return (active === 3);
                    } else if (cube === "#") {
                        return (active >= 2 && active <= 3)
                        // if (adjacent === 0) { 
                        //     return (active >= 5);
                        // } else {
                        //     return (active >= 4);
                        // }
                    }
                }            
            }
        }
        console.log("não retornei antes, erro");
    }

    // copies the current searchArea into newDimension then checks every cube in searchArea, 
    // updates newDimension as needed, and returns newDimension
    doCycle = () => {
        // create a copy of searchArea
        let newDimension = [ ...this.#searchArea ];
        for (let i = 0; i < this.#searchArea.length; i++) {
            newDimension[i] = [ ...this.#searchArea[i] ];
            for (let j = 0; j < this.#searchArea[i].length; j++) {
                newDimension[i][j] = [ ...this.#searchArea[i][j] ];
            }
        }

        for (let x = 0; x < this.#searchArea.length; x++) {
            for (let y = 0; y < this.#searchArea[x].length; y++) {
                for (let z = 0; z < this.#searchArea[x][y].length; z++) {
                    if (this.checkCubes(this.searchArea[x][y][z], [x, y, z])) {
                        newDimension[x][y][z] = "#"
                    } else {
                        newDimension[x][y][z] = "."
                    }
                }
            }
        }
        return newDimension;
    }

    #checkOutOfBounds(coord, directions, adjX, adjY, adjZ, x, y, z) {
        // same z
        directions[0] = (adjY < 0 && z === 0 || directions[0]); // up
        directions[1] = (adjY >= this.#searchArea[coord[0]].length && z === 0 || directions[1]); // down
        directions[2] = (adjX < 0 && z === 0 || directions[2]); // left
        directions[3] = (adjX >= this.#searchArea.length && z === 0 || directions[3]); // right
        directions[4] = ((adjX < 0 || adjY < 0) && z === 0 || directions[4]); // up-left
        directions[5] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 0 || directions[5]); // down-left
        directions[6] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 0 || directions[6]); // up-right
        directions[7] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 0 || directions[7]); // down-right


        // in the back
        directions[8] = (adjY < 0 && z === -1 || adjZ < 0 || directions[8]); // up
        directions[9] = (adjY >= this.#searchArea[coord[0]].length && z === -1 || adjZ < 0 || directions[9]); // down
        directions[10] = (adjX < 0 && z === -1 || adjZ < 0 || directions[10]); // left
        directions[11] = (adjX >= this.#searchArea.length && z === -1 || adjZ < 0 || directions[11]); // right
        directions[12] = ((adjX < 0 || adjY < 0) && z === -1 || adjZ < 0 || directions[12]); // up-left
        directions[13] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === -1 || adjZ < 0 || directions[13]); // down-left
        directions[14] = ((adjX >= this.#searchArea.length || adjY < 0) && z === -1 || adjZ < 0 || directions[14]); // up-right
        directions[15] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === -1 || adjZ < 0 || directions[15]); // down-right


        // in front
        directions[16] = (adjY < 0 && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[16]); // up
        directions[17] = (adjY >= this.#searchArea[coord[0]].length && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[17]); // down
        directions[18] = (adjX < 0 && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[18]); // left
        directions[19] = (adjX >= this.#searchArea.length && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[19]); // right
        directions[20] = ((adjX < 0 || adjY < 0) && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[20]); // up-left
        directions[21] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[21]); // down-left
        directions[22] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[22]); // up-right
        directions[23] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 1 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[23]); // down-right


        // the same x, y as current in back and front
        directions[24] = (adjZ < 0 && x === 0 && y === 0 || directions[24]); // back
        directions[25] = (adjZ >= this.#searchArea[coord[0]][coord[1]].length && x === 0 && y === 0 || directions[25]); // front
    }

    solveFirstPart = () => {
        for (let i = 0; i < 6; i++) {
            this.#searchArea = this.expandSearchArea(this.#dimension);
            this.#dimension = this.doCycle();            
        }

        return this.#dimension.reduce((acc, curr) => {
                    for (let i = 0; i < curr.length; i++) {
                        for (let j = 0; j < curr[i].length; j++) {
                            if (curr[i][j] === "#") {
                                acc++;
                            }
                        }
                    }
                    return acc;
                }, 0);
    }
}

// let's test the result of expandSearchArea without using mocha, I want to have a visual I'm going to use the debugger
// actually I was having problems in thinking what I should assert for after expandSearchArea is called ;)
const solver = new Day17Solver(initialState);

// a last test in debugger before going to mocha
// const dimAfter1stCycle = solver.doCycle();

console.time("part 1");
console.log("\nSolution for Day 17 - First puzzle:", solver.solveFirstPart());
console.timeEnd("part 1");

module.exports = { Day17Solver, initialState };