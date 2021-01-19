/*
    ****** Advent Of Code 2020 ******

    Solution for day 15
    https://adventofcode.com/2020/day/15

    Author: João Marcos Jardim
*/

const startingNumbers = new Array(14, 8, 16, 0, 1, 17); //this time we don't need a input file
// const startingNumbers = [0, 3, 6];

class Day15Solver {
    lastSpoken = 0; 
    #startingNumbers = [];
    #spokenTurns = [];

    constructor(startingNumbers) {
        this.#startingNumbers = startingNumbers;
    }

    // won't run anymore
    playFirstTurn = () => {
        let lastNumber = -1;
        let currentTurn = 1;

        //first turn
        // always check if we are speaking the starting numbers
        if (currentTurn <= this.#startingNumbers.length) {
            lastNumber = this.#startingNumbers[currentTurn - 1];
        } else if (this.lastSpoken.filter(spoken => spoken === lastNumber).length === 1) {
            lastNumber = 0; // if last number appears only once it's because it was the first time speaking it so next is 0
        } else {
            // calculate how many turns from the last time spoken
            const spokenLastTimeAt = this.lastSpoken.filter((spoken, turn) => turn < this.lastSpoken.length - 1).lastIndexOf(lastNumber) + 1;
            lastNumber = currentTurn - 1 - spokenLastTimeAt;
        }
        this.lastSpoken.push(lastNumber);
        
        return this.lastSpoken;
    }

    // won't run anymore
    playNextTurn = () => {
        let lastNumber = this.lastSpoken.length === 0 ? -1 : this.lastSpoken[this.lastSpoken.length - 1];
        let currentTurn = (this.lastSpoken.length === 0 ? 0 : this.lastSpoken.length) + 1;

        // always check if we are speaking the starting numbers
        if (currentTurn <= this.#startingNumbers.length) {
            lastNumber = this.#startingNumbers[currentTurn - 1];
        } else if (this.lastSpoken.filter(spoken => spoken === lastNumber).length === 1) {
            lastNumber = 0; // if last number appears only once it's because it was the first time speaking it so next is 0
        } else {
            // calculate how many turns from the last time spoken
            const spokenLastTimeAt = this.lastSpoken.filter((spoken, turn) => turn < this.lastSpoken.length - 1).lastIndexOf(lastNumber) + 1;
            lastNumber = currentTurn - 1 - spokenLastTimeAt;
        }
        this.lastSpoken.push(lastNumber);
        
        return this.lastSpoken;
    }

    // this is a little better // won't run anymore
    playNextTurn2 = () => {
        let lastNumber = this.lastSpoken.length === 0 ? -1 : this.lastSpoken[this.lastSpoken.length - 1];
        let currentTurn = (this.lastSpoken.length === 0 ? 0 : this.lastSpoken.length) + 1;

        // always check if we are speaking the starting numbers
        if (currentTurn <= this.#startingNumbers.length) {
            lastNumber = this.#startingNumbers[currentTurn - 1];
        } else {
            // calculate how many turns from the last time spoken
            let i = -1;
            for (i = this.lastSpoken.length - 2; i >= 0; i--) {
                if (this.lastSpoken[i] === lastNumber) {
                    break;
                }
            }
            if (i < 0) {
                lastNumber = 0;
            }
            else {
                lastNumber = currentTurn - 1 - (i + 1);
            }
        }
        this.lastSpoken.push(lastNumber);
        
        return this.lastSpoken;
    }

    playNextTurn3 = currentTurn => {
        let lastNumber = this.lastSpoken;
        //let currentTurn = (this.lastSpoken.length === 0 ? 0 : this.lastSpoken.length) + 1;

        // always check if we are speaking the starting numbers
        if (currentTurn <= this.#startingNumbers.length) {
            lastNumber = this.#startingNumbers[currentTurn - 1];
            this.#spokenTurns[lastNumber] = [currentTurn, currentTurn];
        } else {
            // calculate how many turns from the last time spoken
            lastNumber = this.#spokenTurns[lastNumber][this.#spokenTurns[lastNumber].length-1] 
                - this.#spokenTurns[lastNumber][this.#spokenTurns[lastNumber].length-2];
            
            if (!this.#spokenTurns[lastNumber]) {
                this.#spokenTurns[lastNumber] = [currentTurn, currentTurn];
            } else {
                this.#spokenTurns[lastNumber][0] = this.#spokenTurns[lastNumber][1];
                this.#spokenTurns[lastNumber][1] = currentTurn;
            }
        }
        this.lastSpoken = lastNumber;
    }

    solveFirstPart = () => {
        this.lastSpoken = [];
        for (let i = 0; i < 2020; i++) {
            this.playNextTurn3(i + 1);
        }

        return this.lastSpoken;
    }

    solveSecondPart = () => {
        this.lastSpoken = [];
        this.#spokenTurns = new Array(30000000);
        for (let i = 0; i < 30000000; i++) {
            this.playNextTurn3(i + 1);
        }

        return this.lastSpoken;
    }
}

const solver = new Day15Solver(startingNumbers);

console.time("part1");
console.log("\nSolution for Day 15 - First puzzle:", solver.solveFirstPart());
console.timeEnd("part1");

console.time("part2");
console.log("\nSolution for Day 15 - Second puzzle:", solver.solveSecondPart());
console.timeEnd("part2");

module.exports = Day15Solver;