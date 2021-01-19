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
    #rules = [];

    constructor(tickets) {
        this.#rules = tickets.slice(0, tickets.indexOf("your ticket:") - 1);
        this.#tickets = tickets.slice(tickets.indexOf("nearby tickets:") + 1, tickets.length - 2);
    }
}

module.exports = Day16Solver;