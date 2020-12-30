/*
    ****** Advent Of Code 2020 ******

    Solution for day 3
    https://adventofcode.com/2020/day/3

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const theMap = readInputFile("Day 3");

/*
    Algorithm for Day 3 - First puzzle

    1. Set the horizontal limit in which the layout repeats itself (this will be the length of the line on the map)
    2. "move to the right" by adding the constant of 3 on x
    3. "move down" by adding the constant of 1 on y which is theMap iterator
    4. if x is higher then horizontal limit then substrct horizontal limit from x
    5. get the element on y and x coordinates of the map
    6. if it's a # add a tree on trees
*/

let step = 1;
const countTrees = (right, down) => {
    const horLimit = theMap[0].length;
    const moveRight = right;
    const moveDown = down;

    let x = 0;
    let y = 0;
    let trees = 0;    

    while (y < theMap.length) {
        x += moveRight;
        y += moveDown;    
        x = x - horLimit >= 0 ? x - horLimit : x;
        if (y < theMap.length) {
            trees += theMap[y][x] === "#" ? 1 : 0;
        }
        step++;
    }
    return trees;
}

console.log("\nResult of Day 3 - First puzzle:", countTrees(3, 1));
console.log("Steps to solve", step);


/*
    Algorithm for Day 3 - Second puzzle

    1. Create an array of slopes
    2. Set the horizontal limit in which the layout repeats itself (this will be the length of the line on the map)
    3. Loop through the slopes
    2. "move to the right" on the current slope
    3. "move down" on the current slope
    4. if x is higher then horizontal limit then substrct horizontal limit from x
    5. get the element on y and x coordinates of the map
    6. if it's a # add a tree on trees
    7. multiply number of trees on each slope
*/

const slopes = [{ right: 1, down: 1 }, 
    { right: 3, down: 1 }, 
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 }];

step = 1;
let treesProd = 1;
for (const { right, down } of slopes) {
    treesProd *= countTrees(right, down);
    step++; // sum of steps from countTrees and steps in this loop
}

console.log("\nResult of Day 3 - Second puzzle:", treesProd);
console.log("Steps to solve", step);