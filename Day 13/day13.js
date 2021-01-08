/*
    ****** Advent Of Code 2020 ******

    Solution for day 13
    https://adventofcode.com/2020/day/13

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const busDepartures = readInputFile("Day 13");

/*
    Algorithm for Day 13 - First puzzle
    
    1. create an array of bus id's, filter out non working ones (x)
    2. loop
    3. divide your estimate by bus id (get the integer part only, save the remainder)
    4. if result * id is lower than your estimate then wait time = bus id minus remainder of division
    5. if result * id is higher than your estimate then wait time = remainder
    6. get the bus id with lowest wait time
    7. result is the wait time * bus id
*/

const yourEstimate = Number.parseInt(busDepartures[0]);
const busesIds = busDepartures[1].split(",").filter(value => value !== "x");
let nextBusId = 0;

busesIds.forEach(value => {
    const busId = Number.parseInt(value);
    const travels = Math.trunc(yourEstimate / busId);
    const remainingMin = yourEstimate - busId * travels;
    let waitTime = 0;
    if (busId * travels < yourEstimate) {
        waitTime = busId - remainingMin;
    } else {
        waitTime = remainingMin;
    }
})