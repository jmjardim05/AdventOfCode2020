/*
    ****** Advent Of Code 2020 ******

    Solution for day 2
    https://adventofcode.com/2020/day/2

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const listOfPolicyPasswords = readInputFile("Day 2");

/*
    Algorithm for day 2 - first puzzle
    1. split each value into policy/password
    2. get min and max ocurrences
    3. read the mandatory character
    4. count all ocurrences of mandatory character in password
    5. if number of courrences is between min and max ocurrences, count it
*/
const listOfPasswordObjects = listOfPolicyPasswords.map(value => {
    return {
        policy: value.split(":")[0],
        password: value.split(":")[1]
    }
});

let step = 1;
let validPasswords = 0;
for (let { policy, password } of listOfPasswordObjects) {
    const listOfParameters = policy.split(/[-,\s]/);
    if (password) {
        const chars = Array.from(password); // const chars = [...password];
        const matchChars = chars.reduce((prev, value) => {
                if (value === listOfParameters[2]) {
                    prev += value;
                } 
                return prev;
            }, "");
        if (matchChars.length >= Number.parseInt(listOfParameters[0]) && matchChars.length <= Number.parseInt(listOfParameters[1])) {
            validPasswords++;
        }
    }
    step++;
}

console.log("\nResult of Day 2 - First puzzle:", validPasswords);
console.log("Steps to solve: ", step);


/*
    Algorithm for day 2 - second puzzle
    1. split each value into policy/password
    2. get start index and end index values
    3. read the mandatory character
    4. search mandatory character in start index
    5. search mandatory character in end index
    6. if found in both or none of indexes then it's invalid
    7. if found in one of the indexes it's valid
*/

// password objects already read

step = 1;
validPasswords = 0;
for (let { policy, password } of listOfPasswordObjects) {
    const listOfParameters = policy.split(/[-,\s]/);
    if (password) {
        const startIndex = Number.parseInt(listOfParameters[0]);
        const endIndex = Number.parseInt(listOfParameters[1]);
        const chars = Array.from(password); // const chars = [...password];
        const firstOcurrence = chars.indexOf(listOfParameters[2], startIndex); // passwords are 1-based index, password start with a whitespace (index 0)
        const lastOcurrence = chars.indexOf(listOfParameters[2], endIndex);
        if ((firstOcurrence === startIndex || lastOcurrence === endIndex) && !(firstOcurrence === startIndex && lastOcurrence === endIndex)) {
            validPasswords++;
        }
    }
    step++;
}

console.log("\nResult of Day 2 - Second puzzle:", validPasswords);
console.log("Steps to solve: ", step);