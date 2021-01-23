/*
    ****** Advent Of Code 2020 ******

    Solution for day 16
    https://adventofcode.com/2020/day/16

    Author: João Marcos Jardim
*/

const readInputFile = require("../../readInput");
const tickets = readInputFile("Day 16");

class Day16Solver {
    #tickets = [];
    #yourTicket = [];
    #rules = [];
    #errorRate = 0;

    constructor(tickets) {
        this.#rules = tickets.slice(0, tickets.indexOf("your ticket:") - 1);
        this.#yourTicket = tickets[tickets.indexOf("your ticket:") + 1].split(",");
        this.#tickets = tickets.slice(tickets.indexOf("nearby tickets:") + 1, tickets.length - 1);
    }

    get rules() { return this.#rules }
    get tickets() { return this.#tickets }
    get errorRate() { return this.#errorRate }
    get yourTicket() { return this.#yourTicket }

    // a value is valid if passes ANY rule of ANY field for part 1 of the puzzle
    // we consolidate all the rules so we have them all at once
    consolidateRules = () => {
        return this.#rules.reduce((consolidate, rule) => {
            //class: 1-3 or 5-7
            const ruleDesc = rule.split(": ")[1].split(" or ");
            for (let i = 0; i < ruleDesc.length; i++) {
                consolidate.push(ruleDesc[i])
            }
            return consolidate;
        }, []);
    }

    // returns true if value is in a field range of values
    inRuleValueRange = (value, rule) => {
        const minVal = Number.parseInt(rule.split("-")[0]);
        const maxVal = Number.parseInt(rule.split("-")[1]);
        return (value >= minVal && value <= maxVal) 
    }

    // check if ticket values is valid against any of the rules
    // if a value is invalid against all rules then adds the value to error rate
    validateTicket = (ticket, rules) => {        
        for (const field of ticket.split(",")) {
            let valid = false;
            for (const range of rules) {
                valid = valid || this.inRuleValueRange(Number.parseInt(field), range);
                if (valid) {
                    break;
                }
            }
            if (!valid) {                
                this.#errorRate += Number.parseInt(field);
            }
        }
    }

    // first part, sum all invalid values
    solveFirstPart = () => {
        const consolidateRules = this.consolidateRules();
        let invalidTickets = [];
        let lastErrorRate = 0;
        for (const ticket of this.#tickets) {
            this.validateTicket(ticket, consolidateRules);
            if (lastErrorRate !== this.#errorRate) {
                invalidTickets.push(ticket);
                lastErrorRate = this.#errorRate;
            }
        }

        // this helps solve part 2, delete all invalid tickets
        for(const invalid of invalidTickets) {
            this.#tickets.splice(this.#tickets.indexOf(invalid), 1);
        }

        return this.#errorRate;
    }

    // for part 2 we need to know which field is which
    determineFields = () => {
        const consolidateRules = this.consolidateRules();
        let fieldsPosition = new Array(this.#rules.length);
        let candidateFields = new Array(this.#rules.length);

        // we start from the first tiicket checking all other tickets what field each value references
        const values = this.#tickets[0].split(",");
        for (let i = 0; i < values.length; i++) {
            candidateFields[i] = [];
            for (let rulePos = 0; rulePos < consolidateRules.length; rulePos += 2) {
                let found = (this.inRuleValueRange(Number.parseInt(values[i]), consolidateRules[rulePos])
                            || this.inRuleValueRange(Number.parseInt(values[i]), consolidateRules[rulePos+1]));
                if (found) {
                    for (let j = 1; j < this.#tickets.length; j++) {                        
                        const next = this.#tickets[j].split(",");
                        found = (found && (this.inRuleValueRange(Number.parseInt(next[i]), consolidateRules[rulePos])
                                        || this.inRuleValueRange(Number.parseInt(next[i]), consolidateRules[rulePos+1])));
                        if (!found) {
                            break; // stop verifying if it's invalid
                        }
                    }
                }
                if (found) {
                    const ruleIndex = Math.trunc(rulePos/2);
                    candidateFields[i].push(ruleIndex);
                }
            }
        }

        // we got all the candidadte fields, now we need to determine which field is which
        // we going to find any field with only one candidate field (this is already the definitive field)
        // then eliminate this field from all other candidates and repeat the process until every item
        // has only one field left

        let finished = candidateFields.every(value => value.length === 1);
        let i = -1;
        while (!finished) {
            i = candidateFields.findIndex((value, index) => value.length === 1 && fieldsPosition[index] === undefined);
            if (i === -1) {
                throw new Error("não vai funcionar, seu oreiudo");
            }
            const valToDelete = candidateFields[i][0];
            fieldsPosition[i] = valToDelete;

            for (let j = 0; j < candidateFields.length; j++) {
                if (j !== i && candidateFields[j].length > 1) {
                    const indexToDelete = candidateFields[j].indexOf(valToDelete);
                    if (indexToDelete >= 0) {
                        candidateFields[j].splice(indexToDelete, 1);
                    }
                }
            }
            finished = candidateFields.every(value => value.length === 1);
        }
        // need to populate the last empty index on fields position
        i = candidateFields.findIndex((value, index) => value.length === 1 && fieldsPosition[index] === undefined);
        if (i === -1) {
            throw new Error("não vai funcionar, seu oreiudo");
        }
        const valToDelete = candidateFields[i][0];
        fieldsPosition[i] = valToDelete;

        return fieldsPosition;
    }

    // we use this to see if it's called six times (there are 6 departure fields)
    multiplyDepartureValue = (n, value) => n * value;

    // second part, discard invalid tickets, multiply values of departure fields of your ticket
    solveSecondPart = () => {        
        const fieldsPosition = this.determineFields();
        let result = 1;        
        for (let i = 0; i < fieldsPosition.length; i++) {
            if (this.#rules[fieldsPosition[i]].includes("departure")) {
                result = this.multiplyDepartureValue(result, this.#yourTicket[i]);
            }
        } 

        return result;
    }
}

const solver = new Day16Solver(tickets);
console.time("part 1");
console.log("\nSolution for Day 16 - First puzzle:", solver.solveFirstPart());
console.timeEnd("part 1");

console.time("part 2");
console.log("\nSolution for Day 16 - Second puzzle:", solver.solveSecondPart());
console.timeEnd("part 2");

module.exports = { Day16Solver, tickets };