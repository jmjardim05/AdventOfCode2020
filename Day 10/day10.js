/*
    ****** Advent Of Code 2020 ******

    Solution for day 10
    https://adventofcode.com/2020/day/10

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const adapterList = readInputFile("Day 10");

/*
    Algorithm for Day 10 - First puzzle
    
    1. sort the list
    2. calculate the difference from current to prior (starting with 0)
    3. if difference is 1 add to joltDiff_1
    4. if difference is 2 add to joltDiff_2
    5. if difference is 3 add to joltDiff_3
    6. add a plus difference to joltDiff_3 (your device's built-in adapter)
    7. Result is joltDiff_1 * joltDiff_3
*/

adapterList.pop(); // removes the empty string
const numberList = adapterList.map(value => Number.parseInt(value)); // convert each number to int
const sortedList = numberList.sort((a, b) => a - b);
let joltDiff_1 = 0;
let joltDiff_2 = 0;
let joltDiff_3 = 0;

sortedList.forEach((value, index, arr) => {
    let diff = 0;
    const joltage = value;
    if (index === 0) {
        diff = joltage;
    } else {
        diff = joltage - arr[index - 1];
    }

    switch (diff) {
        case 1: joltDiff_1++; break;
        case 2: joltDiff_2++; break;
        case 3: joltDiff_3++; break;
    }
});

joltDiff_3++; // your device built-in adapter joltage diff is always of 3 of your highest joltage adapter

console.log("Joltage differences of 1:", joltDiff_1);
console.log("Joltage differences of 2:", joltDiff_2);
console.log("Joltage differences of 3:", joltDiff_3);

console.log("\nSolution for Day 10 - First puzzle:", joltDiff_1 * joltDiff_3);

/*
    Algorithm for Day 10 - First puzzle
    
    1. sort the list
    2. from 0 create a list of possible next values (should exist in your list)
    3. iterate each value
        get possible values
        return count
        repeat it recursively
    7. Result is the total
*/

const firstPossibleList = [1, 2, 3];
const countedList = [];
const lastAdapter = sortedList[sortedList.length - 1];
const countPossibilities = (possibleList) => {
    let finished = 0;
    let count = 0;
    possibleList.forEach(value => {
        const counted = countedList.find(item => item[0] === value);
        if (!counted) {
            if (sortedList.indexOf(value) >= 0) {

                const nextPossibleList = [value + 1, value + 2, value + 3];
                if (value === lastAdapter) {
                    finished = 1; // only count if it reaches the last adapter
                } else if (value + 1 <= lastAdapter) {
                    const fromThisValue = countPossibilities(nextPossibleList);
                    count += fromThisValue;
                    countedList.push([value, fromThisValue]);
                }
            }
        } else {
            count += counted[1]; // we already counted all the possibilities from the value
        }
    });
    return finished + count;
}

const totalPossibilities = countPossibilities(firstPossibleList);
console.log("\nSolution for Day 10 - Second puzzle:", totalPossibilities);