/*
    ****** Advent Of Code 2020 ******

    Solution for day 4
    https://adventofcode.com/2020/day/4

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const passports = readInputFile("Day 4");

/*
    Algorithm for Day 4 - first puzzle

    1. Create an array of passport objects, each blank line separates them
        we're gonna loop the input Array
        split each line on white spaces
        add the object to a new array when it reaches a blank line
    2. Check if it has all the fields, let's use Object.keys() for each passport
    3. It'd valid when it has 8 fields, or it's missing only 'cid'
        note: check for duplicates
*/

let step = 0;
const passportObjects = [];
let passportObj = {};
passports.forEach(value => {
    if (value !== "") {
        const keyValuePair = value.split(" ");
        passportObj = {
            ...passportObj,
            ...keyValuePair.reduce((prev, value) => {
                    const [key, fieldValue] = value.split(":");
                    return {
                        ...prev,
                        [key]: fieldValue
                    }
                }, {})
        }
    } else {
        passportObjects.push({ ...passportObj });
        passportObj = {};
    }
    step++;
});

const totalValid = passportObjects.reduce((valid, passport) => {
    const fields = Object.keys(passport);
    const fieldCount = fields.length;
    if (fieldCount === 8 || (fieldCount === 7 && fields.indexOf("cid") < 0))
        valid++;
    step++;    
    return valid;
}, 0);

console.log("\nResult of Day 4 - First puzzle:", totalValid);
console.log("Steps to solve", step);


/*
    Algorithm for Day 4 - second puzzle

    The same steps for first puzzle
    But add a new validation layer on step 3

    rules for validate each field:
    byr (Birth Year) - four digits; at least 1920 and at most 2002.
    iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    hgt (Height) - a number followed by either cm or in:
    If cm, the number must be at least 150 and at most 193.
    If in, the number must be at least 59 and at most 76.
    hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    pid (Passport ID) - a nine-digit number, including leading zeroes.
    cid (Country ID) - ignored, missing or not.
*/

// to validate height we need a few more steps
const validateHeight = measure => {    
    if (measure.match(/^\d+(cm|in)$/g) != null) {
        if (measure.indexOf("cm") > 0) {
            const value = Number.parseInt(measure.split("cm")[0]);
            return (value >= 150 && value <= 193);
        } else {
            if (measure.indexOf("in") > 0) {
                const value = Number.parseInt(measure.split("in")[0]);
                return (value >= 59 && value <= 76);
            }
        }
    }
}

const validateFields = passport => {
    let isValid = true;
    for (const [key, value] of Object.entries(passport)) {        
        switch (key) {
            case "byr": isValid = (isValid && (value >= 1920 && value <= 2002)); break;
            case "iyr": isValid = (isValid && (value >= 2010 && value <= 2020)); break;
            case "eyr": isValid = (isValid && (value >= 2020 && value <= 2030)); break;
            case "hgt": isValid = (isValid && validateHeight(value)); break;
            case "hcl": isValid = (isValid && (value.match(/^#[0-9a-f]{6}$/g) != null)); break;
            case "ecl": isValid = (isValid && (value.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/g) != null)); break;
            case "pid": isValid = (isValid && (value.match(/^[0-9]{9}$/g) != null)); break;
            case "cid": isValid = (isValid && true); break;
            default: isValid = false; // in case of invalid field name
        }        
        if (!isValid) {
            break; // exit the loop as soon as possible, when not valid
        }        
    }
    return isValid;
}

step = 0;
// reuse passportObjects from first puzzle, (step will count the validation only)
const actualValid = passportObjects.reduce((valid, passport) => {
    const fields = Object.keys(passport);
    const fieldCount = fields.length;
    if (fieldCount === 8 || (fieldCount === 7 && fields.indexOf("cid") < 0)) {
        const isValid = validateFields(passport);
        if (isValid) {
            valid++;
        }
    }
    step++;    
    return valid;
}, 0);

console.log("\nResult of Day 4 - Second puzzle:", actualValid);
console.log("Steps to solve (validation only)", step);