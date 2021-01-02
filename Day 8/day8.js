/*
    ****** Advent Of Code 2020 ******

    Solution for day 8
    https://adventofcode.com/2020/day/8

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const bootInstructions = readInputFile("Day 8");

/*
    Algorithm for Day 8 - First puzzle

    1. get the last instruction index
    2. start an infinite loop (while true)    
    3. read command
        if in executed list then exit loop        
    4. store the command in the executed list
        if acc then accumulate the argument into the acc variable, go to the next instruction
        if jmp then jump to the next instruction indicated by the argument
        if nop then go to the next instruction
    5. the loop will exit when the next instruction is higher than the last instruction index ( it won't ;-) )
    6. result will be the value of acc variable
*/

// get the last instruction index
const lastInstructionIndex = bootInstructions.length - 1;
let index = 0;

const executeCommands = acc => {
    let executed = [];
    while (true) {
        // read command
        const command = bootInstructions[index];

        // if in executed list then exit loop
        if (executed.indexOf(index) >= 0) {
            break;
        } 
        
        executed.push(index); // store the command in the executed list

        if (command.indexOf("acc") >= 0) {        
            acc += Number.parseInt(command.split(" ")[1]);
            index++;
        } else if (command.indexOf("jmp") >= 0) {
            index += Number.parseInt(command.split(" ")[1]);
        } else {        
            index++;
        }

        // the loop will exit when the next instruction is higher than the last instruction index ( it won't ;-) )
        if (index > lastInstructionIndex) {
            break; // won't reach this
        }
    }
    return acc;
}

let acc = executeCommands(0);

console.log("\nSolution for Day 8 - First puzzle:", acc);

/*
    Algorithm for Day 8 - Second puzzle

    1. get the last instruction index
    2. for each boot instruction
        1. read command
            if jmp then change to nop
            if nop then change to jmp
        2. start an infinite loop (while true)    
        3. read command
            if in executed list then exit loop
        4. store the command in the executed list
            if acc then accumulate the argument into the acc variable, go to the next instruction
            if jmp then jump to the next instruction indicated by the argument
            if nop then go to the next instruction
        5. the loop will exit when the next instruction is higher than the last instruction index ( now it has to execute )
    3. ensure that index is greater than last index to end the loop
    4. result will be the value of acc variable

    let's refactor first solution into a function to solve 2.2 - 2.5
*/

for (let cmdIndex = 0; cmdIndex < lastInstructionIndex; cmdIndex++) {
    const command = bootInstructions[cmdIndex];
    index = 0;
    if (command.indexOf("acc") >= 0) {
        continue;
    } else if (command.indexOf("jmp") >= 0) {
        const jmp = bootInstructions.splice(cmdIndex, 1, command.replace("jmp", "nop"))[0];
        acc = executeCommands(0);
        bootInstructions.splice(cmdIndex, 1, jmp);
    } else if (command.indexOf("nop") >= 0) {
        const nop = bootInstructions.splice(cmdIndex, 1, command.replace("nop", "jmp"))[0];
        acc = executeCommands(0);
        bootInstructions.splice(cmdIndex, 1, nop);
    }

    if (index > lastInstructionIndex) {
        break;
    }
}

console.log("\nSolution for Day 8 - Second puzzle:", acc);