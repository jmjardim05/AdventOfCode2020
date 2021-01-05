/*
    ****** Advent Of Code 2020 ******

    Solution for day 11
    https://adventofcode.com/2020/day/11

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const seatsMap = readInputFile("Day 11");

/*
    Algorithm for Day 11 - First puzzle
    
    1. loop
    2. create a new array (the seats after the rules are applied to all of the seats)
    2. calculate the adjacent seats
    3. if current status is free "L" check for all free adjacent seats (treat floor "." as a free seat)
    4. if all adjacent seats are free store the seat in the new array as occupied "#"
    5. if current status is occupied "#" check for four or more adjacent occupied seats (ignore floor "." and free "L")
    6. if at least four adjacent seats are occupied store the seat in the new array as free "L"
    7. else store the seat unchanged
    8. if is a floor store again in the new array
    9. if the new array is equal to the old one then exit loop and count occupied seats
*/

const originalSeats = seatsMap.map(value => value.split("")); // this will convert to a bi-dimensional array
let currentSeats = [ ...originalSeats ];
let newSeats = [];

const checkDirection = (x, y, i) => {
    if (x === 0 && y === -i) {
        return 0; // up
    } else if (x === 0 && y === +i) {
        return 1; // down
    } else if (x === -i && y === 0) {
        return 2; // left
    } else if (x === +i && y === 0) {
        return 3; // right    
    } else if (x === -i && y === -i) {
        return 4; // up-left
    } else if (x === -i && y === +i) {
        return 5; // down-left
    } else if (x === +i && y === -i) {
        return 6; // up-right
    } else if (x === +i && y === +i) {
        return 7; // down-right    
    } else {
        return -1; // invalid direction
    }
}

const checkSeats = (seat, coord, adjacent = 0) => {
    if (seat === ".") {
        return false; // status unchanged
    }
    
    let occupied = 0;
    let free = 0;

    // up, down, left, right, up-left, down-left, up-right, down-right
    let directions = [false, false, false, false, false, false, false, false];

    let max = 0;
    if (adjacent > 0) {
      max = adjacent + 1;
    } else {
      max = currentSeats.length > currentSeats[0].length ? currentSeats.length : currentSeats[0].length;
    }
    for (let i = 1; i < max; i++) {
        for (let x = -i; x <= i; x += i) {
            for (let y = -i; y <= i; y += i) {
                const adjX = coord[0] + x;
                const adjY = coord[1] + y;

                if (adjX === coord[0] && adjY === coord[1]) {
                    continue; // do not check actual position
                }

                // flags true by out of bounds
                directions[0] = (adjY < 0 || directions[0]);
                directions[1] = (adjY >= currentSeats.length || directions[1]);
                directions[2] = (adjX < 0 || directions[2]);
                directions[3] = (adjX >= currentSeats[coord[1]].length || directions[3]);
                directions[4] = (adjX < 0 || adjY < 0 || directions[4]);
                directions[5] = (adjX < 0 || adjY >= currentSeats.length || directions[5]);
                directions[6] = (adjX > currentSeats[coord[1]].length || adjY < 0 || directions[6]);
                directions[7] = (adjX > currentSeats[coord[1]].length || adjY >= currentSeats.length || directions[7]);

                // do not look further after finding a seat in the direction
                const direction = checkDirection(x, y, i);
                if (directions[direction]) {
                    continue;
                }

                if (currentSeats[adjY][adjX] !== ".") {
                    switch (currentSeats[adjY][adjX]) {
                        case "#": occupied++; break;
                        case "L": free++; break;
                    }

                    // flags true depending on which direction we are facing
                    directions[direction] = true;
                } else if (adjacent > 0) {
                    directions[direction] = true;    
                }
            }
            
            // return after finding a seat or reach the limit in all 8 directions
            if (directions.every(found => found)) {
                if (seat === "L") {
                    return (occupied === 0);
                } else if (seat === "#") {
                    if (adjacent === 0) { 
                        return (occupied >= 5);
                    } else {
                        return (occupied >= 4);
                    }
                }
            }            
        }
    }
}

const predictSeatsUsage = adjacentOnly => {
    while (!currentSeats.every((value, index) => index < newSeats.length && value.join() === newSeats[index].join()))
    {
        if (newSeats.length > 0) {
            currentSeats = [ ...newSeats ];
            newSeats = [];
        }

        for (let y = 0; y < currentSeats.length; y++) {
            let row = currentSeats[y];
            let newRow = [];
            for (let x = 0; x < row.length; x++) {
                let statusChanged = false;
                if (adjacentOnly) {
                    statusChanged = checkSeats(row[x], [x, y], 1);
                } else {
                    statusChanged = checkSeats(row[x], [x, y]);
                }
                if (statusChanged) {
                    newRow.push(currentSeats[y][x] === "L" ? "#" : "L");
                } else {
                    newRow.push(currentSeats[y][x]);
                }
            }
            newSeats.push(newRow);
        }
    }
} 

predictSeatsUsage(true);
const occupiedSeats = () => newSeats.reduce((arr, value) => {
        arr = arr.concat(value.filter(seat => seat === "#"));
        return arr;
    }, []).length;

console.log("\nSolution for Day 11 - First puzzle:", occupiedSeats());

// set back to the original positions
currentSeats = [ ...originalSeats ];
newSeats = [];

predictSeatsUsage(false);
console.log("\nSolution for Day 11 - Second puzzle:", occupiedSeats());