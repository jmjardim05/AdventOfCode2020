/*
    ****** Advent Of Code 2020 ******

    Solution for day 1, first and second puzzle

    Author: João Marcos Jardim
*/

// read the input file
const fs = require("fs");
const input = fs.readFileSync("./Day 1/input.txt", "utf-8");

// create an array of codes
const codes = input.split("\n");

console.log("Solving first puzzle of Day 1\n\n");

/*  
    algorithm for day 1 - first puzzle

    1. read a value and store as first number
    2. subtract 2020 (target for adding the two numbers) from value and store as second number
    3. find the result in list
    4. if found exit loop
    5. multiply both values
*/

const target = 2020;
let firstNumber = 0;
let secondNumber = 0;
let step = 1;

for (let code of codes) {
    console.log("Step", step);
    console.log("-------");

    firstNumber = Number.parseInt(code);
    console.log("Got first number:", firstNumber);
    secondNumber = target - firstNumber;
    console.log("Calculate second number:", secondNumber);
    const found = codes.find(value => Number.parseInt(value) === secondNumber);
    if (found) {
      console.log("Found 2nd number, exiting loop");
      break;
    }
    console.log("Target not achieved, get next 1st number");
    step++;
}

const result1 = firstNumber * secondNumber;

console.log("\nResult of Day1 - First puzzle:", result1, `(${firstNumber} x ${secondNumber})`);
console.log("Steps to solve: ", step);

console.log("\n\nSolving second puzzle of Day 1\n\n");

/*  
    algorithm for day 1 - second puzzle

    1. read a value and store as first number
    2. subtract 2020 from value and store as new target (original target is 2020 for adding the three numbers)
    3. filter list with numbers less than new target
    4. read second number from the new list of possbile values
    5. subtract new target from second number and store as thirdNumber
    6. find the result in list
    7. if found exit loop
    8. multiply found values
*/

firstNumber = 0;
secondNumber = 0;
let thirdNumber = 0;
step = 1;

for (let code of codes) {
    console.log("Step", step);
    console.log("-------");

    firstNumber = Number.parseInt(code);
    console.log("Got first number:", firstNumber);
    const newTarget = target - firstNumber;
    console.log("Calculate new target:", newTarget);
    const listOfPossibleValues = codes.filter(value => Number.parseInt(value) < newTarget);
    console.log("Filtered out the possible values to solve the new target");
    let found = false;
    for (let code2 of listOfPossibleValues) {
        secondNumber = Number.parseInt(code2);
        console.log("Got second number:", secondNumber);
        thirdNumber = newTarget - secondNumber;
        console.log("Calculate third number:", thirdNumber);
        found = listOfPossibleValues.find(value => Number.parseInt(value) === thirdNumber);
        if (found) {
            console.log("Found 3rd number, exiting loop");
            break;
        }
        console.log("3rd number not found, get next 2nd number\n");
    }
    if (found) {
        console.log("Exiting first loop"); 
        break;
    }
    console.log("Target not achieved, get next 1st number");
    step++;
}

const result2 = firstNumber * secondNumber * thirdNumber;

console.log("\nResult of Day1 - Second puzzle:", result2, `(${firstNumber} x ${secondNumber} x ${thirdNumber})`);
console.log("Steps to solve: ", step);