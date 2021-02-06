/*
    ****** Advent Of Code 2020 ******

    Solution for day 18
    https://adventofcode.com/2020/day/18

    Author: João Marcos Jardim
*/

const readInputFile = require("../../readInput");
const homework = readInputFile("Day 18");

/*
 *  Algorithm for Day 18 - First puzzle
 *  
 *  1. loop each element
 *     1. save value if it's a number
 *     2. save operator if it's multiplying
 *     4. if is a opening parentheses recursively call this method
 *     5. if is a closing parentheses, return the solution numbers
 *     6. return the solution numbers after the loop
 *  2. reduce by adding all numbers, except if find an operator (must be *) save to multiply later
 * 
 */


class Day18Solver {
    #expressions = [];
    #multiply = false;
    #continueFrom = 0;

    get expressions() { return this.#expressions; }

    constructor(homework) {
        this.#expressions = homework.map(value => value.split(" "));
        this.#expressions.pop(); // remove blank expression from input file
        this.#expressions = this.#expressions.map(value => {
            return value.reduce((acc, curr) => {
                if (curr.includes("(") || curr.includes(")")) {
                    const arr = curr.split("");
                    let arr2 = [];
                    let s = "";
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === "(" || arr[i] === ")") {
                            if (s !== "") {
                                arr2.push(s);
                                s = "";
                            }
                            arr2.push(arr[i]);
                        } else {
                            s += arr[i];
                        }
                    }
                    if (s !== "") {
                        arr2.push(s);
                    }
                    for (let t of arr2) {
                        acc.push(t);
                    }
                } else {
                    acc.push(curr);
                }
                return acc;
            }, [])
        });
    }

    isNumber = value => !Number.isNaN(Number.parseInt(value));

    callback = (prev, value) => {
        let result = 0;
        if (Array.isArray(value)) {
            if (this.#multiply) {
                result = value.reduce(this.callback, 1);
                this.#multiply = true;
            } else {
                result = value.reduce(this.callback, 0);
                this.#multiply = false;
            }
        } else if (Number.isInteger(value)) {
            result = value;
        }
        if (value !== "*") {
            if (this.#multiply) {
                prev *= result;
            } else {
                prev += result;
            }
            this.#multiply = false;
        } else {
            this.#multiply = true;
        }
        return prev;
    }

    solveExpression = expression => {
        let solution = [];
        let priorOp = "*";
        let adding = false;
        for (let i = 0; i < expression.length; i++) {
            if (Number.isInteger(expression[i])) {
                solution.push(expression[i]);
                adding = priorOp === "*" ? false : true;
            } else if (Array.isArray(expression[i])) {
                solution.push(this.solveExpression(expression[i]));
                adding = priorOp === "*" ? false : true;
            } else if (expression[i] == "*") {
                solution.push(expression[i]);
                adding = false;
            }

            if (adding) {
                solution[solution.length - 2] = solution[solution.length - 2] + solution[solution.length - 1];
                solution.pop();
            }

            priorOp = expression[i];
        }

        return solution.reduce(this.callback, 0);
    }

    evaluateExpression = (expression, start = 0) => {
        let solution = [];
        for (let i = start; i < expression.length; i++) {
            if (i < this.#continueFrom) {
                continue;
            }
            const value = expression[i];
            if (this.isNumber(value) && value[value.length - 1] !== ")") {
                solution.push(Number.parseInt(value));
            } else if (value === "*") {
                solution.push(value);
            } else if (value[0] === "(") {
                solution = solution.concat( [ this.evaluateExpression(expression, i + 1) ]);
            } else if (value[value.length - 1] === ")") {
                if (value[0] !== ")") {
                    solution.push(Number.parseInt(value.replace(/\)/g, "")));
                }
                this.#continueFrom = i + 1;
                return solution;
            } 
        }
        return solution;
    }

    solveFirstPart = () => {
        let result = 0;
        for(let i = 0; i < this.#expressions.length; i++) {
            const solution = this.evaluateExpression(this.#expressions[i]);
            this.#continueFrom = 0;
            result += solution.reduce(this.callback, 0);
        }
        return result;
    }

    solveSecondPart = () => {
        let result = 0;
        for(let i = 0; i < this.#expressions.length; i++) {
            const solution = this.evaluateExpression(this.#expressions[i]);
            this.#continueFrom = 0;
            result += this.solveExpression(solution);
        }
        return result;
    }
}

const solver = new Day18Solver(homework);

console.time("part 1");
console.log("\nSolution for Day 18 - First puzzle:", solver.solveFirstPart());
console.timeEnd("part 1");

console.time("part 2");
console.log("\nSolution for Day 18 - Second puzzle:", solver.solveSecondPart());
console.timeEnd("part 2");

module.exports = { Day18Solver, homework };