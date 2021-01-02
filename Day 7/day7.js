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

/*
    Algorithm for Day 7 - Second puzzle

    1. find the shiny gold bag
    2. loop through contents
    3. sum the number of bags
    4. multiply by the quantity of bags containing the actual bag
    5. loop through each bag inside

    the goal is to know how many bags a single shiny gold bag can store

    comment: this one was hard to describe, but the algorithm and the problem urges for recursion, since we
    are looking into bags inside bags ("baginception"), and I was looking for a way to solve without recursion
*/

// find the shiny gold bag
const shinyGoldBag = luggageRules.filter(value => value.indexOf("shiny gold") === 0)[0];

// loop through each stored bag
const storedBags = shinyGoldBag.split("contain")[1].split(",");
const countBags = (bags, qty) => {
    let count = 0;
    if (bags.indexOf(" no other bags.") >= 0) {
        return qty; // it's the last bag
    } else {
        // sum the number of bags
        bags.forEach(value => {
            const qtyAndColor = value.trim().replace(".", "").split(" ");
            
            const actualQty = Number.parseInt(qtyAndColor[0]);
            const actualColor = qtyAndColor.slice(1).join(" ");
            const actualBag = luggageRules.filter(value => value.indexOf(actualColor) === 0)[0];
                        
            const newStoredBags = actualBag.split("contain")[1].split(",");
            // multiply by the quantity of bags containing the actual bag
            // loop through each bag inside            
            count += qty * countBags(newStoredBags, actualQty); // ex: 2 (actualQty) vibrant plum bag contains newStoredBags
        });
        return count + qty; // remember to count the quantity of the actualBag, this will cause to count the shiny gold bag
    }
}

const totalBags = countBags(storedBags, 1) - 1; // minus 1, we don't count the shiny gold bag 

console.log("\nSolution for Day 7 - Second puzzle:", totalBags);