/*
    ****** Advent Of Code 2020 ******

    Solution for day 19
    https://adventofcode.com/2020/day/19

    Author: João Marcos Jardim
*/

const readInputFile = require("../../readInput");
const messages = readInputFile("Day 19");

/* 
    Algorithm for Day 19 first puzzle
    
    1. create the regular expression for rule 0:
        1.1 if rule is a fixed char copy the char to the expr
        1.2 if rule is another group open parentheses
        1.3 if rule has a | copy to the expr
        1.4 close the group parentheses
        1.5 repeat steps above for each rule
    
    2. loop through each message and validate against the regex
        2.1 set start (^) and end of line ($) tokens in expression 
        2.2 validate message
        2.3 count if valid
*/

class Day19Solver {
    #rules = [];
    #messages = [];
    #regExp = null;

    get rules() { return this.#rules; }
    get messages() { return this.#messages; }
    get regExp() { return this.#regExp; }

    constructor(allMessages) {
        this.#rules = this.getRules(allMessages);
        this.#messages = this.getMessages(allMessages);
        this.#regExp = new RegExp("^" + this.createRegExpFor("0", this.#rules) + "$");
    }

    getRules = messages => messages.slice(0, messages.indexOf(""));
    getMessages = messages => messages.slice(messages.indexOf("") + 1, messages.length - 1);

    createRegExpFor = (index, rules, i=0, max=1) => {
        let expr = "";
        const rule = rules.find(value => value.startsWith(`${index}:`));

        const groups = rule.split(" ").slice(1);
        for (const group of groups) {
            if (group.includes('"')) {
                expr += group.substr(group.indexOf('"') + 1, group.lastIndexOf('"') - 1);
            } else if (group === "|") {
                expr += "|";
            } else if (group === "8" || group === "11") {
                let n = i;
                if (n < max) {
                    expr += "(" + this.createRegExpFor(group, rules, ++n, max) + ")";
                } else {
                    i = 0;
                }
            } else {
                const nextRule = rules.find(value => value.startsWith(`${group}:`));
                if (!nextRule.split(" ").slice(1).shift().includes('"')) {
                    expr += "(" + this.createRegExpFor(group, rules, i, max) + ")";
                } else {
                    expr += this.createRegExpFor(group, rules, i, max);
                }
            }
        }
        return expr;
    }

    solveFirstPart = () => {
        let result = 0;
        for (let i = 0; i < this.#messages.length; i++) {
            if (this.#messages[i].match(this.#regExp)) {
                result++;
            }
        }
        return result;
    }

/* 
    Algorithm for Day 19 second puzzle
    
    1. update rules 8 and 11

    2. create the regular expression for rule 0:
        1.1 if rule is a fixed char copy the char to the expr
        1.2 if rule is another group open parentheses
        1.3 if rule has a | copy to the expr
        1.3 if rule is 8 or 11, recursion until a edfined max number of iterations is reached
        1.4 close the group parentheses
        1.5 repeat steps above for each rule
    
    2. loop through each message and validate against the regex
        2.1 set start (^) and end of line ($) tokens in expression 
        2.2 validate message
        2.3 count if valid

    this solution solves Day 19, but it doesn't take account for any length of messages (if message is too big, it won't create the regexp)
    an alternative woulde be validating groups 42 and 31 separately (creating a RegExp object for each one) and iterating through message string
*/

    solveSecondPart = () => {
        const rule8 = this.#rules.findIndex(value => value.startsWith("8:"));
        const rule11 = this.#rules.findIndex(value => value.startsWith("11:"));
        this.#rules[rule8] = "8: 42 | 42 8";
        this.#rules[rule11] = "11: 42 31 | 42 11 31";
        // sadly, 19 is a 'magic number' to limit the number of iterations in creating the regex
        // it's the highest number that gives the correct answer in less time (miminum iterations of rules 8 and 11 to validate everything)
        const max = Math.trunc(Math.max( ...this.#messages.map(value => value.length))/19);
        this.#regExp = new RegExp("^" + this.createRegExpFor("0", this.#rules, 0, max) + "$");

        let result = 0;
        for (let i = 0; i < this.#messages.length; i++) {
            if (this.#messages[i].match(this.#regExp)) {
                result++;
            }
        }
        return result;
    }
}

const solver = new Day19Solver(messages);

console.time("part 1");
console.log("\nSolution for Day 19 - First puzzle:", solver.solveFirstPart());
console.timeEnd("part 1");

console.time("part 2");
console.log("\nSolution for Day 19 - Second puzzle:", solver.solveSecondPart());
console.timeEnd("part 2");

module.exports = { messages, Day19Solver };
