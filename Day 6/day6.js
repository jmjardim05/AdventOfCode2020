/*
    ****** Advent Of Code 2020 ******

    Solution for day 6
    https://adventofcode.com/2020/day/6

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const answersByGroup = readInputFile("Day 6");

/*
    Algorithm for Day 6 - First puzzle

    1. create an array of answers
    2. if an answer already exists in the list, skip it
    3. separate answers in groups (each blank line separates two groups)
    4. count all the answers
*/

const answers = answersByGroup.map(value => value === "" ? "@" : value)
                              .join("")
                              .split("@");

const distinctValues = values => {
    const groupAnswers = Array.from(values);
    const result = groupAnswers.reduce((distinct, value) => {
        if (!distinct.find(item => item === value)) {
            distinct.push(value);
        }
        return distinct;
    }, []);
    return result;
}

const answerCount = answers.reduce((count, answer) => {
    const distinctAnswers = distinctValues(answer);
    count += distinctAnswers.length;
    return count;
}, 0);

console.log("\nSolution fot Day 6 - First puzzle:", answerCount);

/*
    Algorithm for Day 6 - Second puzzle

    1. create an array of answers (with number of people)
    2. count the number of people in each group
    3. get the distinct answers for each group
    3. loop through each letter
    4. count if the number of ocurrences is the same of number of people
*/

let groupNo = 0;
let x = "";
let numberOfPeople = 0;
const answersAndGroups = [];
answersByGroup.forEach(value => {
    if (value === "") {
        groupNo++;
        answersAndGroups.push({
            answer: x,
            numberOfPeople,
            groupNo
        });

        x = "";
        numberOfPeople = 0;        
        return;
    }
    numberOfPeople += 1;
    x += value;
});

const newCount = answersAndGroups.reduce((count, item) => {
    const distinctAnswers = distinctValues(item.answer);
    const answerArr = Array.from(item.answer);
    for (const letter of distinctAnswers) {
        if (answerArr.filter(value => value === letter).length === item.numberOfPeople) {
            count++;
        }
    }
    return count;
}, 0);

console.log("\nSolution for Day 6 - Second puzzle:", newCount);