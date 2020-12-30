/*
    ****** Advent Of Code 2020 ******

    Solution for day 7
    https://adventofcode.com/2020/day/7

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const luggageRules = readInputFile("Day 7");

/*
    Algorithm for Day 7 - First puzzle

    1. filter everything by "shiny gold"
    2. count the results
    3. set a new list
    4. for each item get the other bags
    5. filter original list by each bag color
    6. count every result
*/

/*
example:

input

light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.

filter everything by "shiny gold"

bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.

remove where "shiny gold" is the first of list

bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.

store first color [bright white bags, muted yellow bags]

for each item get the other bags

bright white bags
muted yellow bags

filter original list for each bag color

light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.

remove where bag color is the first of list

light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags

store first color (if not exists) [bright white bags, muted yellow bags, light red bags, dark orange bags]

filter original list for each bag color [light red bags, dark orange bags]
if not found exit

result will be length of [bright white bags, muted yellow bags, light red bags, dark orange bags]
*/

// returns only the color ex: extractBagColor("shiny gold bags"); // returns "shiny gold"
const extractBagColor = bag => {
    let color = bag.split("contain")[0];
    color = color.split("bag")[0].trimEnd();
    return color;
} 

// bags that store shiny gold bags directly
const bagsThatStoreShinyGold = luggageRules.filter(value => value.indexOf("shiny gold", 1) > 1);
const bagsColors = bagsThatStoreShinyGold.map(value => extractBagColor(value));
let result = [...bagsColors];

// use recursion to solve all possibilities
const getBagsThatCanContainShinyGold = (bagsColors) => {
    for (const color of bagsColors) {
        const bagsThatStoreThisColor = luggageRules.filter(value => value.indexOf(color, 1) > 1);
        const otherBagsColors = bagsThatStoreThisColor.reduce((prev, value) => {
            const newColor = extractBagColor(value)
            if (!result.includes(newColor)) {
                prev.push(newColor);
            }
            return prev; 
        }, []);
        result = result.concat(otherBagsColors);
        getBagsThatCanContainShinyGold(otherBagsColors);
    }
}

getBagsThatCanContainShinyGold(bagsColors);

console.log("\nSolution for Day 7 - First puzzle:", result.length);