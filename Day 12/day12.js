/*
    ****** Advent Of Code 2020 ******

    Solution for day 12
    https://adventofcode.com/2020/day/11

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const navigationInstructions = readInputFile("Day 12");

/*
    Algorithm for Day 12 - First puzzle
    
    1. create an object to store the values { north, south, east, west, direction }
    2. loop
    3. read the instruction
    4. if F decrement the oposite direction by the value then increment the actual direction by the remainder
    5. if L change direction depending on the value (in degrees) ex: 90 facing north changes to west
    6. if R change direction depending on the value (in degrees) ex: 90 facing north changes to east
    7. if N decrement south by the value then increment north by the remainder
    8. if S decrement north by the value then increment south by the remainder
    9. if E decrement west by the value then increment east by the remainder
    10. if W decrement east by the value then increment west by the remainder
    11. result is the sum of all directions
*/

const directions = ["N", "E", "S", "W"];
const shipPosition = {
    position: [0, 0, 0, 0],
    direction: 1 // 0 - north; 1 - east; 2 - south; 3 - west 
}

const rotateShip = (position, rotateTo, degrees) => {
    const change = Math.trunc(degrees / 360);
    let angle = degrees;
    if (change >= 1) {
        angle -= degrees * change;
    }
    let shift = angle/90;
    let newDirection = 0; 
    switch (rotateTo) {
        case "R": newDirection = position.direction + shift; break;
        case "L": newDirection = position.direction - shift; break;
    }
    if (newDirection < 0) {
        newDirection = directions.length + newDirection;
    } else if (newDirection >= directions.length) {
        newDirection = newDirection - directions.length;
    }
    position.direction = newDirection;
    return [0,1,2,3].includes(position.direction); // returns false if it's a invalid direction
}

const moveShip = (position, direction, units) => {
    // find oposite direction
    const oposite = direction < 2 ? direction + 2: direction - 2;

    const remainder = position.position[oposite] - units;
    if (remainder < 0) {
        position.position[oposite] = 0; 
        position.position[direction] += (remainder * -1);
    } else {
        position.position[oposite] -= units;
    }  
}

for (const instruction of navigationInstructions) {
    if (instruction !== "") {
        const [ navigateTo, value ] = [ instruction[0], instruction.substr(1) ];
        if (navigateTo === "R" || navigateTo === "L") {
            const positionBefore = { ...shipPosition }
            if (!rotateShip(shipPosition, navigateTo, value)) {
                console.log("Error invalid direction", shipPosition.direction, "Instruction", instruction, "Position before", positionBefore);
                break;
            }
        } else {
            const direction = navigateTo == "F" ? shipPosition.direction : directions.indexOf(navigateTo);
            moveShip(shipPosition, direction, value);
        }
    }
}

let manhattanDistance = shipPosition.position.reduce((prev, value) => prev += value, 0);
console.log("\nSolution for Day 12 - First puzzle:", manhattanDistance, "Ship final position", shipPosition);

/*
    Algorithm for Day 12 - First puzzle
    
    1. create an object to store the values { north, south, east, west, direction }
    2. create an waypoint object { north, south, east, west, direction1, direction2 }
    2. loop
    3. read the instruction
    4. if F multiply the current directions on the waypoint by the value and set in the ship positions
    5. if L change direction1 and direction2 on the waypoint depending on the value (in degrees)
    6. if R change direction1 and direction2 on the waypoint depending on the value (in degrees)
    7. if N decrement waypoint's south by the value then increment north by the remainder
    8. if S decrement waypoint's north by the value then increment south by the remainder
    9. if E decrement waypoint's west by the value then increment east by the remainder
    10. if W decrement waypoint's east by the value then increment west by the remainder
    11. result is the sum of all directions ob the ship position
*/

shipPosition.position = [0, 0, 0, 0]; // reset ship position
// don't care about ship direction it's the waypoint that determines the direction now

const waypoint = {
    position: [1, 10, 0, 0], // remember north, east, south, west
    direction1: 1,
    direction2: 0
}

// pretty sure I could reuse the previous rotate and move routines, but let's make this "clearer" ;-)
const rotateWaypoint = (direction, rotateTo, degrees) => {
    const change = Math.trunc(degrees / 360);
    let angle = degrees;
    if (change >= 1) {
        angle -= degrees * change;
    }
    let shift = angle/90;
    let newDirection = 0;
    switch (rotateTo) {
        case "R": newDirection = direction + shift; break;
        case "L": newDirection = direction - shift; break;
    }
    if (newDirection < 0) {
        newDirection = directions.length + newDirection;
    } else if (newDirection >= directions.length) {
        newDirection = newDirection - directions.length;
    }
    return newDirection; // now returns the new direction so we can call it two times once for each direction of the waypoint
}

const moveWaypoint = (position, direction, units) => {
    // find oposite direction
    const oposite = direction < 2 ? direction + 2: direction - 2;

    const remainder = position.position[oposite] - units;
    if (remainder < 0) {
        position.position[oposite] = 0; 
        position.position[direction] += (remainder * -1);
        // need to change the waypoint direction
        if (position.direction1 === oposite) {
            position.direction1 = direction; 
        } else if (position.direction2 === oposite) {
            position.direction2 = direction; 
        }
    } else {
        position.position[oposite] -= units;
    }  
}

for (const instruction of navigationInstructions) {
    if (instruction !== "") {
        const [ navigateTo, value ] = [ instruction[0], instruction.substr(1) ];
        if (navigateTo === "R" || navigateTo === "L") {
            const positionBefore = { ...waypoint }
            let newWaypointPosition = [0, 0, 0, 0]; //new waypoint position
            
            const newDirection1 = rotateWaypoint(waypoint.direction1, navigateTo, value);
            newWaypointPosition[newDirection1] = waypoint.position[waypoint.direction1];

            const newDirection2 = rotateWaypoint(waypoint.direction2, navigateTo, value);
            newWaypointPosition[newDirection2] = waypoint.position[waypoint.direction2];
            
            if (newDirection1 < 0 || newDirection1 >= directions.length) {
                console.log("Error invalid direction", newDirection1, "Instruction", instruction, "Position before", positionBefore);
                break;
            }
            
            waypoint.direction1 = newDirection1;
            waypoint.direction2 = newDirection2;
            waypoint.position = [ ...newWaypointPosition ];
        } else if (navigateTo === "F") {
            // move ship by multiplying the waypoint position by the value on instruction then set to ship position values
            moveShip(shipPosition, waypoint.direction1, waypoint.position[waypoint.direction1] * Number.parseInt(value));
            moveShip(shipPosition, waypoint.direction2, waypoint.position[waypoint.direction2] * Number.parseInt(value));
        } else {
            // move the waypoint
            moveWaypoint(waypoint, directions.indexOf(navigateTo), value);            
        }
    }
}

manhattanDistance = shipPosition.position.reduce((prev, value) => prev += value, 0);
console.log("\nSolution for Day 12 - First puzzle:", manhattanDistance, "Ship final position", shipPosition, "Waypoint final position", waypoint);