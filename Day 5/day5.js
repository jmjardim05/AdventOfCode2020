/*
    ****** Advent Of Code 2020 ******

    Solution for day 5
    https://adventofcode.com/2020/day/5

    Author: João Marcos Jardim
*/

const readInputFile = require("../readInput");
const seatsLocation = readInputFile("Day 5");

/*
    Algorithm for Day 5 - first puzzle

    1. Loop through each letter indicating seat location
    2. set row starting index = 0
    3. set row end index = 128 (last index is 127 but we add 1 so we can divide for the correct middle index)
    4. set row middle index = (end index - starting index) / 2
    5. set column starting index = 0
    6. set column end index = 128 (last index is 7 but we add 1 so we can divide for the correct middle index)
    7. set column middle index = (end index - starting index) / 2
    8. For the first 7 characters which define the row:
        if char is 'F' then set new end index = (middle + 1)
        if char is 'B' then set new starting index = (middle + 1)
        set new middle index will be (end index - starting index) / 2
    9. For the last 3 characters which define the column:
        if char is 'L' then set new end index = (middle + 1)
        if char is 'R' then set new starting index = (middle + 1)
        set new middle index will be (end index - starting index) / 2
    10. the final starting index will determine the row and column
    11. do the math to find the ID: row starting index * 8 + column starting index
    12. store as the highest ID if it's higher than the last one
 */

// const seatWithHighestID = seatsLocation.reduce(
//      (id, passport) => {
//         let rowStartIndex = 0;
//         let rowEndIndex = 128; // last index 127 plus 1
//         let rowMiddleIndex = (rowEndIndex - rowStartIndex) / 2;

//         let colStartIndex = 0;
//         let colEndIndex = 8; // last index 7 plus 1
//         let colMiddleIndex = (colEndIndex - colStartIndex) / 2;

//         const location = Array.from(passport);
//         const seatLocation = location.reduce(
//             (coord, position) => {
//                 switch (position) {
//                     case "F": rowEndIndex = rowMiddleIndex; break;
//                     case "B": rowStartIndex = rowMiddleIndex; break;
//                     case "L": colEndIndex = colMiddleIndex; break;
//                     case "R": colStartIndex = colMiddleIndex; break;
//                 }
//                 rowMiddleIndex = rowEndIndex - ((rowEndIndex - rowStartIndex) / 2);
//                 colMiddleIndex = colEndIndex - ((colEndIndex - colStartIndex) / 2);
//                 coord = [rowStartIndex, colStartIndex];
//                 return coord;
//             }
//         , []);

//         [ row, col ] = seatLocation;
//         const newId = row * 8 + col;
//         if (newId > id) {
//             id = newId;
//         }
//         return id;
//      }
//  , 0);


const allSeats = seatsLocation.reduce(
    (list, passport) => {
        let rowStartIndex = 0;
        let rowEndIndex = 128; // last index 127 plus 1
        let rowMiddleIndex = (rowEndIndex - rowStartIndex) / 2;

        let colStartIndex = 0;
        let colEndIndex = 8; // last index 7 plus 1
        let colMiddleIndex = (colEndIndex - colStartIndex) / 2;

        const location = Array.from(passport);
        const seatLocation = location.reduce(
            (coord, position) => {
                switch (position) {
                    case "F": rowEndIndex = rowMiddleIndex; break;
                    case "B": rowStartIndex = rowMiddleIndex; break;
                    case "L": colEndIndex = colMiddleIndex; break;
                    case "R": colStartIndex = colMiddleIndex; break;
                }
                rowMiddleIndex = rowEndIndex - ((rowEndIndex - rowStartIndex) / 2);
                colMiddleIndex = colEndIndex - ((colEndIndex - colStartIndex) / 2);
                coord = [rowStartIndex, colStartIndex];
                return coord;
            }
        , []);

        [ row, col ] = seatLocation;
        const newId = row * 8 + col;
        list.push({ id: newId, row });
        return list;
    }
, []);

const seatWithHighestID = allSeats.reduce(
    (maxId, seat) => {
        if (seat.id > maxId) {
            maxId = seat.id;
        }
        return maxId;
    }
, 0);

console.log("\nSolution for Day 5 - First puzzle:", seatWithHighestID);

/*
    Algorithm for Day 5 - second puzzle

    1. Loop through each letter indicating seat location
    2. set row starting index = 0
    3. set row end index = 128 (last index is 127 but we add 1 so we can divide for the correct middle index)
    4. set row middle index = (end index - starting index) / 2
    5. set column starting index = 0
    6. set column end index = 128 (last index is 7 but we add 1 so we can divide for the correct middle index)
    7. set column middle index = (end index - starting index) / 2
    8. For the first 7 characters which define the row:
        if char is 'F' then set new end index = (middle + 1)
        if char is 'B' then set new starting index = (middle + 1)
        set new middle index will be (end index - starting index) / 2
    9. For the last 3 characters which define the column:
        if char is 'L' then set new end index = (middle + 1)
        if char is 'R' then set new starting index = (middle + 1)
        set new middle index will be (end index - starting index) / 2
    10. do the math to find the ID: row starting index * 8 + column starting index
    11. store the ID on a list, we need to store the row number
    12. loop through the id list, ignoring the front and back rows (indexes 0 and 127)
    13. set your id as current id + 1
    14. if it finds the ocurrence of your id + 1, exit loop

    note: we are going to refactor first solution to create the id list, the original will be commented
*/

let mySeatId = 0;
for (const seat of allSeats)
{
    if (seat.row === 0 || seat.row === 127) {
        continue;
    }

    mySeatId = seat.id + 1;
    if (!allSeats.find(value => value.id === mySeatId)) { // make sure it's a missing id
        if (allSeats.find(value => (value.row > 0 && value.row < 127 && value.id === mySeatId + 1))) {
            break;
        }
    }
}

console.log("\nSolution for Day 5 - Second puzzle:", mySeatId);