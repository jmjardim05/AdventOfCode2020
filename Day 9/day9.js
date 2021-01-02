/*
    ****** Advent Of Code 2020 ******

    Solution for day 9
    https://adventofcode.com/2020/day/9

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const xmasFile = readInputFile("Day 9");

/*
    Algorithm for Day 9 - First puzzle

    1. define the preamble (for test input = 5, and for final solution = 25)
    2. main loop starts at preamble + 1
    3. sum the preamble numbers prior to the current
        first nested loop starts at current - preamble - 1
        second nested loop starts at first loop index + 1
    4. if sum is equal to current break nested loop, continue main loop
    5. else, break the main loop
    6. result will be the last value of current
*/

const preamble = 25;

const validate = (current, value) => {
    for (let i = current - preamble - 1; i < xmasFile.length; i++) {
        for (let j = i + 1; j < xmasFile.length; j++) {
            const n1 = Number.parseInt(xmasFile[i]);
            const n2 = Number.parseInt(xmasFile[j]);
            if (n1 + n2 === value) {
                return true;
            }
        }
    }
    return false;
}

let currentValue = 0;
for (let i = preamble + 1; i < xmasFile.length; i ++) {
    currentValue = Number.parseInt(xmasFile[i]);
    if (!validate(i, currentValue)) {
        break;
    }
}

console.log("\nSolution for Day 9 - First puzzle:", currentValue);

/*
    Algorithm for Day 9 - Second puzzle

    1. get the last solution (first invalid number on input)
    3. sum the contiguous numbers
        first nested loop starts at index 0
          store in contiguous list
        second nested loop starts at first loop index + 1
          store in contiguous list
    4. if sum is larger than last solution, empty the contiguous list and break the second nested
    5. else, break the main loop
    6. result will be the sum of the smallest and largest numbers on the contiguous list
*/

const findWeakness = value => {
    let weakNumbers = [];
    for (let i = 0; i < xmasFile.length; i++) {
        const n1 = Number.parseInt(xmasFile[i]);
        let sum = n1;
        weakNumbers.push(n1);

        for (let j = i + 1; j < xmasFile.length; j++) {            
            const n2 = Number.parseInt(xmasFile[j]);
            sum += n2;
            weakNumbers.push(n2);

            if (sum > value) {
                weakNumbers = [];
                break;
            } else if (sum === value) {
                return weakNumbers;
            }
        }
    }
    return weakNumbers;
}

const weakNumbers = findWeakness(currentValue).sort((a, b) => a - b);
const smallest = weakNumbers.shift();
const largest = weakNumbers.pop();

console.log("\nSolution for Day 9 - Second puzzle:", smallest + largest);