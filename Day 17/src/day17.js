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

    Second puzzle just adds a dimension, but this seemingly little modification makes the code even larger as now we need
    to look into 80 neighbors to the current cube
    So I tried to write a new variation of the solution into a new source file (day17.new.js), first solution takes more
    to run and second took more than 5 minutes to run.
    A reminder that lines of code and code performance are completely unrelated :-)
    (BTW: about 10 seconds to run second part, not good but still better than 5 minutes)
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
        const w = 0;
        this.#dimension = new Array(initialState.length - 1); //x
        for (let i = 0; i < this.#dimension.length; i++) {
            this.#dimension[i] = new Array(initialState[i].length);
            for (let j = 0; j < this.#dimension[i].length; j++) {
                this.#dimension[i][j] = new Array();
                this.#dimension[i][j][0] = new Array();
            }
        }       
        for (const cubes of initialState) {
            if (cubes !== "") {
                const cubeArr = cubes.split("");
                x = 0;                
                for (const cube of cubeArr) {                                        
                    this.#dimension[x][y][z][w] = cube;
                    x++;
                }
                y++;
            }
        }
        //this.#searchArea = this.expandSearchArea(this.#dimension);
    }

    // check and expands area to search for the next cycle
    expandSearchArea = (currentArea, add4thDim) => {
        let addLeft = false,
            addRight = false,
            addTop = false,
            addBottom = false,
            addFront = false,
            addBack = false,
            addWplus1 = false,
            addWminus1 = false;
        for (let x = 0; x < currentArea.length; x++) {
            for (let y = 0; y < currentArea[x].length; y++) {
                for (let z = 0; z < currentArea[x][y].length; z++) {
                    for (let w = 0; w < (add4thDim ? currentArea[x][y][z].length : 1); w++) {
                        // check to expand x coordinate
                        if (x === 0 && currentArea[x][y][z][w] === "#") {
                            addLeft = true;
                        } else if (x === currentArea.length - 1 && currentArea[x][y][z][w] === "#") {
                            addRight = true;
                        }
                        // check to expand y coordinate
                        if (y === 0 && currentArea[x][y][z][w] === "#") {
                            addTop = true;
                        } else if (y === currentArea[x].length - 1 && currentArea[x][y][z][w] === "#") {
                            addBottom = true;
                        }
                        // check to expand z coordinate
                        if (currentArea[x][y][z][w] === "#" && currentArea[x][y].length === 1) {
                            addBack = true;
                            addFront = true;
                        } else if (z === 0 && currentArea[x][y][z][w] === "#") {
                            addBack = true;
                        } else if (z === currentArea[x][y].length - 1 && currentArea[x][y][z][w] === "#") {
                            addFront = true;
                        }
                        if (add4thDim) {
                            // check to expand w coordinate 
                            if (currentArea[x][y][z][w] === "#" && currentArea[x][y][z][w].length === 1) {
                                addWplus1 = true;
                                addWminus1 = true;
                            } else if (w === 0 && currentArea[x][y][z][w] === "#") {
                                addWminus1 = true;
                            } else if (w === currentArea[x][y][z].length - 1 && currentArea[x][y][z][w] === "#") {
                                addWplus1 = true;
                            }
                        }
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
        const startW = addWminus1 ? 1 : 0;
        const endW = startW + currentArea[0][0][0].length - (addWplus1 ? 1 : 0);

        // initialize searchArea
        this.#searchArea = new Array(currentArea.length + (addLeft ? 1 : 0) + (addRight ? 1 : 0));
        for (let i = 0; i < this.#searchArea.length; i++) {
            this.#searchArea[i] = new Array(currentArea[0].length  + (addTop ? 1 : 0) + (addBottom ? 1 : 0));
            for (let j = 0; j < this.#searchArea[i].length; j++) {
                this.#searchArea[i][j] = new Array(currentArea[0][0].length + (addBack ? 1 : 0) + (addFront ? 1 : 0));
                for (let k = 0; k < this.#searchArea[i][j].length; k++) {
                    this.#searchArea[i][j][k] = new Array(currentArea[0][0][0].length + (addWminus1 ? 1 : 0) + (addWplus1 ? 1 : 0));
                }
            }
        } 

        // create new search area by filling empty with inactive cubes, and inserting the current area
        for (let x = 0; x < this.#searchArea.length; x++) {
            for (let y = 0; y < this.#searchArea[x].length; y++) {
                for (let z = 0; z < this.#searchArea[x][y].length; z++) {
                    for (let w = 0; w < (add4thDim ? this.#searchArea[x][y][z].length : 1); w++) {
                        if (w < startW || w > endW) {
                            this.#searchArea[x][y][z][w] = ".";
                        } else {
                            if (z < startZ || z > endZ) {
                                this.#searchArea[x][y][z][w] = ".";
                            } else if (x < startX || x > endX) {
                                this.#searchArea[x][y][z][w] = ".";
                            } else if (y < startY || y > endY) {
                                this.#searchArea[x][y][z][w] = ".";
                            } else {
                                this.#searchArea[x][y][z][w] = currentArea[x - startX][y - startY][z - startZ][w - startW];
                            }
                        }
                    }
                }
            }
        }

        return this.#searchArea;
    }

    // this is Day11's checkDirection() plus a dimension - or two ;-)
    #checkDirection = (x, y, z, w, i) => { 
        /** W === 0 **/       
        /* *** SAME Z *** */
        if (x === 0 && y === -i && z === 0 && w === 0) {
            return 0; // up
        } else if (x === 0 && y === +i && z === 0 && w === 0) {
            return 1; // down
        } else if (x === -i && y === 0 && z === 0 && w === 0) {
            return 2; // left
        } else if (x === +i && y === 0 && z === 0 && w === 0) {
            return 3; // right    
        } else if (x === -i && y === -i && z === 0 && w === 0) {
            return 4; // up-left
        } else if (x === -i && y === +i && z === 0 && w === 0) {
            return 5; // down-left
        } else if (x === +i && y === -i && z === 0 && w === 0) {
            return 6; // up-right
        } else if (x === +i && y === +i && z === 0 && w === 0) {
            return 7; // down-right
        
            /* *** IN THE BACK *** */
        } else if (x === 0 && y === -i && z === -1 && w === 0) {
            return 8; // up
        } else if (x === 0 && y === +i && z === -1 && w === 0) {
            return 9; // down
        } else if (x === -i && y === 0 && z === -1 && w === 0) {
            return 10; // left
        } else if (x === +i && y === 0 && z === -1 && w === 0) {
            return 11; // right    
        } else if (x === -i && y === -i && z === -1 && w === 0) {
            return 12; // up-left
        } else if (x === -i && y === +i && z === -1 && w === 0) {
            return 13; // down-left
        } else if (x === +i && y === -i && z === -1 && w === 0) {
            return 14; // up-right
        } else if (x === +i && y === +i && z === -1 && w === 0) {
            return 15; // down-right
        
            /* *** IN FRONT *** */    
        } else if (x === 0 && y === -i && z === 1 && w === 0) {
            return 16; // up
        } else if (x === 0 && y === +i && z === 1 && w === 0) {
            return 17; // down
        } else if (x === -i && y === 0 && z === 1 && w === 0) {
            return 18; // left
        } else if (x === +i && y === 0 && z === 1 && w === 0) {
            return 19; // right    
        } else if (x === -i && y === -i && z === 1 && w === 0) {
            return 20; // up-left
        } else if (x === -i && y === +i && z === 1 && w === 0) {
            return 21; // down-left
        } else if (x === +i && y === -i && z === 1 && w === 0) {
            return 22; // up-right
        } else if (x === +i && y === +i && z === 1 && w === 0) {
            return 23; // down-right

        } else /* *** SAME Z AND W = -1 *** */
        if (x === 0 && y === -i && z === 0 && w === -1) {
            return 26; // up
        } else if (x === 0 && y === +i && z === 0 && w === -1) {
            return 27; // down
        } else if (x === -i && y === 0 && z === 0 && w === -1) {
            return 28; // left
        } else if (x === +i && y === 0 && z === 0 && w === -1) {
            return 29; // right    
        } else if (x === -i && y === -i && z === 0 && w === -1) {
            return 30; // up-left
        } else if (x === -i && y === +i && z === 0 && w === -1) {
            return 31; // down-left
        } else if (x === +i && y === -i && z === 0 && w === -1) {
            return 32; // up-right
        } else if (x === +i && y === +i && z === 0 && w === -1) {
            return 33; // down-right
        
            /* *** IN THE BACK AND W = -1 *** */
        } else if (x === 0 && y === -i && z === -1 && w === -1) {
            return 34; // up
        } else if (x === 0 && y === +i && z === -1 && w === -1) {
            return 35; // down
        } else if (x === -i && y === 0 && z === -1 && w === -1) {
            return 36; // left
        } else if (x === +i && y === 0 && z === -1 && w === -1) {
            return 37; // right    
        } else if (x === -i && y === -i && z === -1 && w === -1) {
            return 38; // up-left
        } else if (x === -i && y === +i && z === -1 && w === -1) {
            return 39; // down-left
        } else if (x === +i && y === -i && z === -1 && w === -1) {
            return 40; // up-right
        } else if (x === +i && y === +i && z === -1 && w === -1) {
            return 41; // down-right
        
            /* *** IN FRONT AND W = -1 *** */    
        } else if (x === 0 && y === -i && z === 1 && w === -1) {
            return 42; // up
        } else if (x === 0 && y === +i && z === 1 && w === -1) {
            return 43; // down
        } else if (x === -i && y === 0 && z === 1 && w === -1) {
            return 44; // left
        } else if (x === +i && y === 0 && z === 1 && w === -1) {
            return 45; // right    
        } else if (x === -i && y === -i && z === 1 && w === -1) {
            return 46; // up-left
        } else if (x === -i && y === +i && z === 1 && w === -1) {
            return 47; // down-left
        } else if (x === +i && y === -i && z === 1 && w === -1) {
            return 48; // up-right
        } else if (x === +i && y === +i && z === 1 && w === -1) {
            return 49; // down-right

        } else /* *** SAME Z AND W = +1 *** */
        if (x === 0 && y === -i && z === 0 && w === 1) {
            return 50; // up
        } else if (x === 0 && y === +i && z === 0 && w === 1) {
            return 51; // down
        } else if (x === -i && y === 0 && z === 0 && w === 1) {
            return 52; // left
        } else if (x === +i && y === 0 && z === 0 && w === 1) {
            return 53; // right    
        } else if (x === -i && y === -i && z === 0 && w === 1) {
            return 54; // up-left
        } else if (x === -i && y === +i && z === 0 && w === 1) {
            return 55; // down-left
        } else if (x === +i && y === -i && z === 0 && w === 1) {
            return 56; // up-right
        } else if (x === +i && y === +i && z === 0 && w === 1) {
            return 57; // down-right
        
            /* *** IN THE BACK AND W = +1 *** */
        } else if (x === 0 && y === -i && z === -1 && w === 1) {
            return 58; // up
        } else if (x === 0 && y === +i && z === -1 && w === 1) {
            return 59; // down
        } else if (x === -i && y === 0 && z === -1 && w === 1) {
            return 60; // left
        } else if (x === +i && y === 0 && z === -1 && w === 1) {
            return 61; // right    
        } else if (x === -i && y === -i && z === -1 && w === 1) {
            return 62; // up-left
        } else if (x === -i && y === +i && z === -1 && w === 1) {
            return 63; // down-left
        } else if (x === +i && y === -i && z === -1 && w === 1) {
            return 64; // up-right
        } else if (x === +i && y === +i && z === -1 && w === 1) {
            return 65; // down-right
        
            /* *** IN FRONT AND W = +1 *** */    
        } else if (x === 0 && y === -i && z === 1 && w === 1) {
            return 66; // up
        } else if (x === 0 && y === +i && z === 1 && w === 1) {
            return 67; // down
        } else if (x === -i && y === 0 && z === 1 && w === 1) {
            return 68; // left
        } else if (x === +i && y === 0 && z === 1 && w === 1) {
            return 69; // right    
        } else if (x === -i && y === -i && z === 1 && w === 1) {
            return 70; // up-left
        } else if (x === -i && y === +i && z === 1 && w === 1) {
            return 71; // down-left
        } else if (x === +i && y === -i && z === 1 && w === 1) {
            return 72; // up-right
        } else if (x === +i && y === +i && z === 1 && w === 1) {
            return 73; // down-right

            /* *** SAME X,Y AS CURRENT *** */    
        } else if (x === 0 && y === 0 && z === -i && w === 0) {
            return 24; // back
        } else if (x === 0 && y === 0 && z === i && w === 0) {
            return 25; // front
        } else if (x === 0 && y === 0 && z === -i && w === -1) {
            return 74; // back
        } else if (x === 0 && y === 0 && z === i && w === -1) {
            return 75; // front
        } else if (x === 0 && y === 0 && z === -i && w === 1) {
            return 76; // back
        } else if (x === 0 && y === 0 && z === i && w === 1) {
            return 77; // front        
        }else if (x === 0 && y === 0 && z === 0 && w === -1) {
            return 78; // back
        } else if (x === 0 && y === 0 && z === 0 && w === 1) {
            return 79; // front
        }  else {
            return -1; // invalid direction
        }
    }

    // we're going to modify Day 11's checkSeats() as is a similar algorithm adding one dimension
    checkCubes = (cube, coord, withW) => {
        let active = 0;
        let inactive = 0;
    
        // now with the addition of one more dimension we have to take more directions into account
        // considering the z coordinate
        //
        // same z      : up, down, left, right, up-left, down-left, up-right, down-right, 
        // in front    : up, down, left, right, up-left, down-left, up-right, down-right,
        // in the back : up, down, left, right, up-left, down-left, up-right, down-right,
        // same x,y as current cube: front, back 
        let directions = new Array(withW ? 80 : 26);

        const max = 2;
        for (let i = 1; i < max; i++) {
            for (let x = -i; x <= i; x += i) {
                for (let y = -i; y <= i; y += i) {
                    for (let z = -1; z <= i; z += i) {
                        for (let w = (withW ? -1 : 0); w <= (withW ? i : 0); w += i) {
                            const adjX = coord[0] + x;
                            const adjY = coord[1] + y;
                            const adjZ = coord[2] + z;
                            const adjW = coord[3] + w;

                            if (adjX === coord[0] && adjY === coord[1] && adjZ === coord[2] && coord[3] === adjW) {
                                continue; // do not check actual position
                            }

                            // flags directions true by out of bounds
                            this.#checkOutOfBounds(coord, directions, adjX, adjY, adjZ, adjW, x, y, z, w, withW); 
                            
                            // do not look further after finding a cube in the direction
                            const direction = this.#checkDirection(x, y, z, w, i);
                            if (directions[direction]) {
                                continue;
                            }

                            switch (this.#searchArea[adjX][adjY][adjZ][adjW]) {
                                case "#": active++; break;
                                case ".": inactive++; break;
                            }

                            // flags true depending on which direction we are facing
                            directions[direction] = true;
                        }
                    }
                }
                
                // return after finding a cube or reach the limit in all 26 directions
                if (directions.every(found => found)) {
                    if (cube === ".") {
                        return (active === 3);
                    } else if (cube === "#") {
                        return (active >= 2 && active <= 3);
                    }
                }            
            }
        }
        console.log("não retornei antes, erro");
    }

    // copies the current searchArea into newDimension then checks every cube in searchArea, 
    // updates newDimension as needed, and returns newDimension
    doCycle = (withW) => {
        // create a copy of searchArea
        let newDimension = this.copySearchArea(this.#searchArea);

        for (let x = 0; x < this.#searchArea.length; x++) {
            for (let y = 0; y < this.#searchArea[x].length; y++) {
                for (let z = 0; z < this.#searchArea[x][y].length; z++) {
                    for (let w = 0; w < this.#searchArea[x][y][z].length; w++) {
                        if (this.checkCubes(this.#searchArea[x][y][z][w], [x, y, z, w], withW)) {
                            newDimension[x][y][z][w] = "#"
                        } else {
                            newDimension[x][y][z][w] = "."
                        }
                    }
                }
            }
        }
        return newDimension;
    }

    copySearchArea(dimension) {
        let newDimension = [...dimension];
        for (let i = 0; i < dimension.length; i++) {
            newDimension[i] = [...dimension[i]];
            for (let j = 0; j < dimension[i].length; j++) {
                newDimension[i][j] = [...dimension[i][j]];
                for (let k = 0; k < dimension[i][j].length; k++) {
                    newDimension[i][j][k] = [...dimension[i][j][k]];
                }
            }
        }
        return newDimension;
    }

    #checkOutOfBounds(coord, directions, adjX, adjY, adjZ, adjW, x, y, z, w, withW) {
        /* W === 0 */
        // same z
        directions[0] = (adjY < 0 && z === 0 && w === 0 || directions[0]); // up
        directions[1] = (adjY >= this.#searchArea[coord[0]].length && z === 0 && w === 0 || directions[1]); // down
        directions[2] = (adjX < 0 && z === 0 && w === 0 || directions[2]); // left
        directions[3] = (adjX >= this.#searchArea.length && z === 0 && w === 0 || directions[3]); // right
        directions[4] = ((adjX < 0 || adjY < 0) && z === 0 && w === 0 || directions[4]); // up-left
        directions[5] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 0 && w === 0 || directions[5]); // down-left
        directions[6] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 0 && w === 0 || directions[6]); // up-right
        directions[7] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 0 && w === 0 || directions[7]); // down-right


        // in the back
        directions[8] = (adjY < 0 && z === -1 && w === 0 || adjZ < 0 || directions[8]); // up
        directions[9] = (adjY >= this.#searchArea[coord[0]].length && z === -1 && w === 0 || adjZ < 0 || directions[9]); // down
        directions[10] = (adjX < 0 && z === -1 && w === 0 || adjZ < 0 || directions[10]); // left
        directions[11] = (adjX >= this.#searchArea.length && z === -1 && w === 0 || adjZ < 0 || directions[11]); // right
        directions[12] = ((adjX < 0 || adjY < 0) && z === -1 && w === 0 || adjZ < 0 || directions[12]); // up-left
        directions[13] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === -1 && w === 0 || adjZ < 0 || directions[13]); // down-left
        directions[14] = ((adjX >= this.#searchArea.length || adjY < 0) && z === -1 && w === 0 || adjZ < 0 || directions[14]); // up-right
        directions[15] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === -1 && w === 0 || adjZ < 0 || directions[15]); // down-right


        // in front
        directions[16] = (adjY < 0 && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[16]); // up
        directions[17] = (adjY >= this.#searchArea[coord[0]].length && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[17]); // down
        directions[18] = (adjX < 0 && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[18]); // left
        directions[19] = (adjX >= this.#searchArea.length && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[19]); // right
        directions[20] = ((adjX < 0 || adjY < 0) && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[20]); // up-left
        directions[21] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[21]); // down-left
        directions[22] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[22]); // up-right
        directions[23] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 1 && w === 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[23]); // down-right
        
        // the same x, y as current in back and front
        directions[24] = (adjZ < 0 && x === 0 && y === 0 && w === 0 || directions[24]); // back
        directions[25] = (adjZ >= this.#searchArea[coord[0]][coord[1]].length && x === 0 && y === 0 && w === 0 || directions[25]); // front

        if (withW) {
            /* W === -1 */
            // same z
            directions[26] = (adjY < 0 && z === 0 && w === -1 || adjW < 0 || directions[26]); // up
            directions[27] = (adjY >= this.#searchArea[coord[0]].length && z === 0 && w === -1 || adjW < 0 || directions[27]); // down
            directions[28] = (adjX < 0 && z === 0 && w === -1 || adjW < 0 || directions[28]); // left
            directions[29] = (adjX >= this.#searchArea.length && z === 0 && w === -1 || adjW < 0 || directions[29]); // right
            directions[30] = ((adjX < 0 || adjY < 0) && z === 0 && w === -1 || adjW < 0 || directions[30]); // up-left
            directions[31] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 0 && w === -1 || adjW < 0 || directions[31]); // down-left
            directions[32] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 0 && w === -1 || adjW < 0 || directions[32]); // up-right
            directions[33] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 0 && w === -1 || adjW < 0 || directions[33]); // down-right


            // in the back
            directions[34] = (adjY < 0 && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[34]); // up
            directions[35] = (adjY >= this.#searchArea[coord[0]].length && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[35]); // down
            directions[36] = (adjX < 0 && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[36]); // left
            directions[37] = (adjX >= this.#searchArea.length && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[37]); // right
            directions[38] = ((adjX < 0 || adjY < 0) && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[38]); // up-left
            directions[39] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[39]); // down-left
            directions[40] = ((adjX >= this.#searchArea.length || adjY < 0) && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[40]); // up-right
            directions[41] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === -1 && w === -1 || adjZ < 0 || adjW < 0 || directions[41]); // down-right


            // in front
            directions[42] = (adjY < 0 && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[42]); // up
            directions[43] = (adjY >= this.#searchArea[coord[0]].length && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[43]); // down
            directions[44] = (adjX < 0 && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[44]); // left
            directions[45] = (adjX >= this.#searchArea.length && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[45]); // right
            directions[46] = ((adjX < 0 || adjY < 0) && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[46]); // up-left
            directions[47] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[47]); // down-left
            directions[48] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[48]); // up-right
            directions[49] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 1 && w === -1 || adjW < 0 || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[49]); // down-right

            
            /* W === +1 */
            // same z
            directions[50] = (adjY < 0 && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[50]); // up
            directions[51] = (adjY >= this.#searchArea[coord[0]].length && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[51]); // down
            directions[52] = (adjX < 0 && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[52]); // left
            directions[53] = (adjX >= this.#searchArea.length && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[53]); // right
            directions[54] = ((adjX < 0 || adjY < 0) && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[54]); // up-left
            directions[55] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[55]); // down-left
            directions[56] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[56]); // up-right
            directions[57] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[57]); // down-right


            // in the back
            directions[58] = (adjY < 0 && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[58]); // up
            directions[59] = (adjY >= this.#searchArea[coord[0]].length && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[59]); // down
            directions[60] = (adjX < 0 && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[60]); // left
            directions[61] = (adjX >= this.#searchArea.length && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[61]); // right
            directions[62] = ((adjX < 0 || adjY < 0) && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[62]); // up-left
            directions[63] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[63]); // down-left
            directions[64] = ((adjX >= this.#searchArea.length || adjY < 0) && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[64]); // up-right
            directions[65] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === -1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ < 0 || directions[65]); // down-right


            // in front
            directions[66] = (adjY < 0 && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[66]); // up
            directions[67] = (adjY >= this.#searchArea[coord[0]].length && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[67]); // down
            directions[68] = (adjX < 0 && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[68]); // left
            directions[69] = (adjX >= this.#searchArea.length && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[69]); // right
            directions[70] = ((adjX < 0 || adjY < 0) && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[70]); // up-left
            directions[71] = ((adjX < 0 || adjY >= this.#searchArea[coord[0]].length) && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[71]); // down-left
            directions[72] = ((adjX >= this.#searchArea.length || adjY < 0) && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[72]); // up-right
            directions[73] = ((adjX >= this.#searchArea.length || adjY >= this.#searchArea[coord[0]].length) && z === 1 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || adjZ >= this.#searchArea[coord[0]][coord[1]].length || directions[73]); // down-right
            
            directions[74] = (adjZ < 0 && x === 0 && y === 0 && w === -1 || adjW < 0 || directions[74]); // back
            directions[75] = (adjZ >= this.#searchArea[coord[0]][coord[1]].length && x === 0 && y === 0 && w === -1 || adjW < 0 || directions[75]); // front

            directions[76] = (adjZ < 0 && x === 0 && y === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[76]); // back
            directions[77] = (adjZ >= this.#searchArea[coord[0]][coord[1]].length && x === 0 && y === 0 && w === 1 || adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length || directions[77]); // front
            
            directions[78] = (adjW < 0 && z === 0 && x === 0 && y === 0 || directions[78]); // back
            directions[79] = (adjW >= this.#searchArea[coord[0]][coord[1]][coord[2]].length && z === 0 && x === 0 && y === 0 || directions[79]); // front
        }
    }

    solveFirstPart = () => {
        this.#searchArea = this.copySearchArea(this.#dimension);
        for (let i = 0; i < 6; i++) {
            this.#searchArea = this.expandSearchArea(this.#searchArea, false);
            this.#searchArea = this.doCycle(false);            
        }

        return this.#searchArea.reduce((acc, curr) => {
                    for (let i = 0; i < curr.length; i++) {
                        for (let j = 0; j < curr[i].length; j++) {
                            for (let k = 0; k < curr[i][j].length; k++) {
                                if (curr[i][j][k] === "#") {
                                    acc++;
                                }
                            }
                        }
                    }
                    return acc;
                }, 0);
    }

    solveSecondPart = () => {
        this.#searchArea = this.copySearchArea(this.#dimension);
        for (let i = 0; i < 6; i++) {
            this.#searchArea = this.expandSearchArea(this.#searchArea, true);
            this.#searchArea = this.doCycle(true);            
        }

        return this.#searchArea.reduce((acc, curr) => {
                    for (let i = 0; i < curr.length; i++) {
                        for (let j = 0; j < curr[i].length; j++) {
                            for (let k = 0; k < curr[i][j].length; k++) {
                                if (curr[i][j][k] === "#") {
                                    acc++;
                                }
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

console.time("part 2");
console.log("\nSolution for Day 17 - Second puzzle:", solver.solveSecondPart());
console.timeEnd("part 2");

module.exports = { Day17Solver, initialState };