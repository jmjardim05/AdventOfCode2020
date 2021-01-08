const readInputFile = function (day) {
    // read the input file
    const fs = require("fs");
    const input = fs.readFileSync(`../${day}/input-teste.txt`, "utf-8");

    // return an array of the puzzle input
    const inputArray = input.split("\n");
    return inputArray;
}

module.exports = readInputFile;