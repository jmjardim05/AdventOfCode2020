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
let minWaitTime = Infinity;

busesIds.forEach(value => {
    const busId = Number.parseInt(value);
    const travels = Math.trunc(yourEstimate / busId);
    const remainingMin = yourEstimate - busId * travels;
    let waitTime = 0;
    if (busId * travels < yourEstimate) {
        waitTime = busId - remainingMin;
    }
    if (waitTime < minWaitTime) {
        minWaitTime = waitTime;
        nextBusId = busId;
    }
});

console.log("\nSolution for Day 13 - First puzzle:", nextBusId * minWaitTime, " Bus Id", nextBusId, "Wait time", minWaitTime);

/*
    Algorithm for Day 13 - Second puzzle
    
    algorithm 2 - (incrementing the first bus id and looking at the other id's)
    1. create an array of bus id's (now consider the non working)
    2. loop
    3. add first id (next bus travel)
    4. set a boolean to true (means every id departed at the offset time from each other)
    5. loop from second id
    6. get the remainder of next bus travel + index (index will be equal to the offset) divided by current id
    7. if remainder different than 0 then set boolean to false exit loop, go to next iteration of first id travel
    8. else continue
    9. if current bus id is 'x' continue loop
    10. after exiting loop, if boolean is true exit travel iteration of first id
    11. result is the last iteration of first id (current next bus travel)
    NOTE: it worked for some of the test input, with less id's... need to find more efficient logic

    algorithm 2 - little optimization by incrementing the min id by the value that multiplied + offset is a valid departure for max id
    NOTE: It took more than 1 hour (1:12:11.574 (h:mm:ss.mmm) to be exactly), at least is the correct answer :\

    algorithm 2 - final optimization - still not found a solution, I'm feeling dumb :(
*/

console.time("part2 - Optimized");
const findEarliestTimeStamp = () => {
    let arr = [ ...busesIds.map(value => Number.parseInt(value)) ];
    const arr2 = busDepartures[1].split(",");

    const minBusId = Math.min(...arr);
    const minBusIdIndex = arr2.indexOf(minBusId.toString());

    let maxBusId = Math.max(...arr);
    let maxBusIdIndex = arr2.indexOf(maxBusId.toString());
    
    let offsetMinMax = maxBusIdIndex - minBusIdIndex;
    const findTimeStampFactor = (i, id, offset, factor) => {
        let found = false;
        while (!found) {            
            const nextBusTravel = id * factor + offset;
            const y = nextBusTravel % maxBusId;
            found = y === 0;
            factor += i;
        }
        factor -= i;
        const maxId = arr.splice(arr.indexOf(maxBusId), 1)[0];
        maxBusId = Math.max(...arr);
        maxBusIdIndex = arr2.indexOf(maxBusId.toString());
        offsetMinMax = maxBusIdIndex - minBusIdIndex;
        if (offsetMinMax !== 0) {
            const nextIterator = i * maxId;
            factor = findTimeStampFactor(nextIterator, minBusId, offsetMinMax, factor);
        }
        return factor;
    }
    return minBusId * findTimeStampFactor(1, minBusId, offsetMinMax, 1) - minBusIdIndex;
}
console.log("\nSolution for Day 13 - Second puzzle (optimized):", findEarliestTimeStamp());
console.timeEnd("part2 - Optimized");

// this is the original (bad) code
console.time("part2");
const allBuses = busDepartures[1].split(",").reduce((prev, value, index) => {
    if (value !== "x") {
        prev.push([value, index]);
    }
    return prev;
}, []);
const maxBusId = Math.max(...busesIds.map(value => Number.parseInt(value)));
const minBusId = Math.min(...busesIds.map(value => Number.parseInt(value)));
const maxBusIdIndex = allBuses.find(value => value[0] == maxBusId)[1];
const minBusIdIndex = allBuses.find(value => value[0] == minBusId)[1];
const offsetMinMax = maxBusIdIndex - minBusIdIndex;

let next = 0;
let x = 0; // 'x' will store the next number in which the 'min id' times 'x' plus the 'offset' will be 'max id' departure timestamp
let found = false;
while (!found) {
    next++;
    const nextBusTravel = maxBusId * next - offsetMinMax;
    const y = nextBusTravel % minBusId;
    x = nextBusTravel / minBusId;
    found = y === 0;
}

found = false;
let earliestTimestamp = 0;
while (!found) {
    found = true;
    for (let i = 0; i < allBuses.length; i++) {
        const timestamp = minBusId * x - (minBusIdIndex - allBuses[i][1]);        
        if (i === 0) {
            earliestTimestamp = timestamp;
        }
        if (/*allBuses[i] === "x" ||*/ allBuses[i][1] === minBusIdIndex || allBuses[i][1] === maxBusIdIndex) {
            continue;
        }
        const busId = Number.parseInt(allBuses[i][0]);        
        const remainder = timestamp % busId;
        if (remainder !== 0) {
            found = false;            
            break;
        }
    }
    x += maxBusId;
}

console.log("\nSolution for Day 13 - Second puzzle:", earliestTimestamp);
console.timeEnd("part2");