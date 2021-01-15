/*
    ****** Advent Of Code 2020 ******

    Solution for day 14
    https://adventofcode.com/2020/day/14

    Author: João Marcos Jardim
*/

const readInputFile = require("../../readInput");
const initializationProgram = readInputFile("Day 14");

class Day14Solver {
    constructor(program) {
        this.#bootSequence = this.getAllRoutines(program);
    };

    getAllRoutines = boot => {
        return boot.reduce((prev, value) => {
            if (value !== "") {
                if (value.includes("mask")) {
                    prev.push([value]);
                } else {
                    prev[prev.length - 1].push(value);
                }
            }
            return prev;
        }, []);
    }

    convertToBase2 = (value) => {
        let bit = value;
        let result = "";
        while (bit > 1) {
            const remainder = bit % 2;
            result = remainder.toString() + result;
            bit = Math.trunc(bit / 2);
        }
        result = bit.toString() + result;
        return result;
    };

    shiftBits = (mask, bits, version) => {
        let fullBits = bits.padStart(36, "0").split("");
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] !== "X" && version === 1) {
                fullBits[i] = mask[i];
            } else if (mask[i] !== "0" && version === 2) {
                fullBits[i] = mask[i];
            }
        }
        return fullBits.join("");
    };

    applyAddressMask = (mask, bits, size) => {
        let indexToShift = 0;
        let address = mask.split("");
        const applyMask = this.convertToBase2(bits).padStart(size, "0");
        for (let j = 0; j < mask.length; j++) {                        
            if (mask[j] === "X") {
                address[j] = applyMask[indexToShift];
                indexToShift++;
            }
        }
        return address.join("");
    };

    saveToMemory = (bootRoutine, version) => {
        this.#bitMask = bootRoutine[0].split(" = ")[1];
        for (let i = 1; i < bootRoutine.length; i++) {
            const bootInstruction = bootRoutine[i].split(" = ");
            
            const memLocation = bootInstruction[0].replace("mem[", "").replace("]", "");
            const value = bootInstruction[1];
            let bits = "";
            if (version === 1) {
                bits = this.convertToBase2(Number.parseInt(value));                
            } else if (version === 2) {
                bits = this.convertToBase2(Number.parseInt(memLocation));
            }
            const masked = this.shiftBits(this.#bitMask, bits, version);
            this.maskedBits.push(masked);
            
            if (version === 1) {
                const newValue = Number.parseInt(masked, 2);
                const memIndex = this.mem.findIndex(loc => loc[0] === memLocation);
                if (memIndex >= 0) {
                    this.mem.splice(memIndex, 1, [memLocation, newValue]);
                } else {
                    this.mem.push([memLocation, newValue]);
                }
            } else if (version === 2) {
                const floatingBits = masked.split("").filter(bit => bit === "X").join("");
                const max = Number.parseInt(floatingBits.replace(/X/g, "1"), 2);
                for (let j = 0; j <= max; j++) {
                    const address = this.applyAddressMask(masked, j, floatingBits.length);
                    const newLocation = Number.parseInt(address, 2);
                    const memIndex = this.mem.findIndex(loc => loc[0] === newLocation);
                    if (memIndex >= 0) {
                        this.mem.splice(memIndex, 1, [newLocation, Number.parseInt(value)]);
                    } else {
                        this.mem.push([newLocation, Number.parseInt(value)]);
                    }
                }
            }
        }
    };
    
    #bootSequence = [];    
    #bitMask = "";
    mem = [];
    maskedBits = [];

    solveFirstPart = () => {
        this.mem = [];
        for (let i = 0; i < this.#bootSequence.length; i++) {
            this.saveToMemory(this.#bootSequence[i], 1);
        }

        const result = this.mem.reduce((acc, curr) => acc + curr[1], 0);
        return result;
    };

    solveSecondPart = () => {
        this.mem = [];
        for (let i = 0; i < this.#bootSequence.length; i++) {
            this.saveToMemory(this.#bootSequence[i], 2);
        }

        const result = this.mem.reduce((acc, curr) => acc + curr[1], 0);
        return result;
    };
}

const solver = new Day14Solver(initializationProgram);
console.log("\nSolution for Day 14 - First Puzzle:", solver.solveFirstPart());

console.time("part2");
console.log("\nSolution for Day 14 - Second Puzzle:", solver.solveSecondPart());
console.timeEnd("part2");

module.exports = { Day14Solver, initializationProgram };