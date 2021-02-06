const expect = require("chai").expect;

const Day18Solver = require("../src/day18").Day18Solver;
const homework = require("../src/day18").homework;

describe(" -- Test Day 18 Solver class --", function() {
    describe.skip(" ** evaluate expressions **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("first expression must contain [2, '*', 3, [4, '*', 5]]", function() {
            const solution = solver.evaluateExpression(solver.expressions[0]);
            solver.continueFrom = 0;
            expect(solution.length).to.equal(4);
            expect(solution[0]).to.equal(2);
            expect(solution[1]).to.equal("*");
            expect(solution[2]).to.equal(3);
            expect(solution[3][0]).to.equal(4);
            expect(solution[3][1]).to.equal("*");
            expect(solution[3][2]).to.equal(5);
        });

        it("result of first expression must be 26", function() {
            // 2 * 3 + (4 * 5)
            const solution = solver.evaluateExpression(solver.expressions[0]);
            solver.continueFrom = 0;
            const resultFirstExpression = solution.reduce(solver.callback, 0);
            expect(resultFirstExpression).to.equal(26);
        });
    });

    // 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) = 12240
    describe.skip("** run evaluate expression for 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("expression must contain [5, '*', 9, '*',  [7, '*', 3, '*', 3, 9, '*', 3, [8, 6, '*', 4]]]]", function() {
            const solution = solver.evaluateExpression(solver.expressions[2]);
            solver.continueFrom = 0;
            expect(solution.length).to.equal(5);
            expect(solution[0]).to.equal(5);
            expect(solution[1]).to.equal("*");
            expect(solution[2]).to.equal(9);
            expect(solution[3]).to.equal("*");
            expect(solution[4][0]).to.equal(7);
            expect(solution[4][1]).to.equal("*");
            expect(solution[4][2]).to.equal(3);
            expect(solution[4][3]).to.equal("*");
            expect(solution[4][4]).to.equal(3);
            expect(solution[4][5]).to.equal(9);
            expect(solution[4][6]).to.equal("*");
            expect(solution[4][7]).to.equal(3);
            expect(solution[4][8][0]).to.equal(8);
            expect(solution[4][8][1]).to.equal(6);
            expect(solution[4][8][2]).to.equal("*");
            expect(solution[4][8][3]).to.equal(4);
        });

        it("result of expression must be 12240", function() {
            const solution = solver.evaluateExpression(solver.expressions[2]);
            solver.continueFrom = 0;
            const resultFirstExpression = solution.reduce(solver.callback, 0);
            expect(resultFirstExpression).to.equal(12240);
        });
    });

    // ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 = 13632
    describe.skip("** run evaluate expression for ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("expression must contain [[[2, 4, '*', 9], '*',  [6, 9, '*', 8, 6], 6], 2, 4, '*', 2]", function() {
            const solution = solver.evaluateExpression(solver.expressions[3]);
            solver.continueFrom = 0;
            expect(solution.length).to.equal(5);
            expect(solution[0][0][0]).to.equal(2);
            expect(solution[0][0][1]).to.equal(4);
            expect(solution[0][0][2]).to.equal("*");
            expect(solution[0][0][3]).to.equal(9);
            expect(solution[0][1]).to.equal("*");
            expect(solution[0][2][0]).to.equal(6);
            expect(solution[0][2][1]).to.equal(9);
            expect(solution[0][2][2]).to.equal("*");
            expect(solution[0][2][3]).to.equal(8);
            expect(solution[0][2][4]).to.equal(6);
            expect(solution[0][3]).to.equal(6);
            expect(solution[1]).to.equal(2);
            expect(solution[2]).to.equal(4);
            expect(solution[3]).to.equal("*");
            expect(solution[4]).to.equal(2);
        });

        it("result of expression must be 13632", function() {
            const solution = solver.evaluateExpression(solver.expressions[3]);
            solver.continueFrom = 0;
            const resultFirstExpression = solution.reduce(solver.callback, 0);
            expect(resultFirstExpression).to.equal(13632);
        });
    });

    describe.skip("** run solver first part for test input **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("sum of the results of all expressions must be 26335", function() {
            const result = solver.solveFirstPart();
            expect(result).to.equal(26335);
        });
    });

    describe("** run new rule for expression 2 * 3 + (4 * 5) **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("result of the expression must be 46", function() {
            const expression = solver.evaluateExpression(solver.expressions[0]);
            const result = solver.solveExpression(expression);
            expect(result).to.equal(46);
        });
    });

    describe("** run new rule for expression 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("result of the expression must be 669060", function() {
            const expression = solver.evaluateExpression(solver.expressions[2]);
            const result = solver.solveExpression(expression);
            expect(result).to.equal(669060);
        });
    });

    describe("** run new rule for expression ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 **", function() {
        let solver;
        before(function() {
            solver = new Day18Solver(homework);
        });

        it("result of the expression must be 23340", function() {
            const expression = solver.evaluateExpression(solver.expressions[3]);
            const result = solver.solveExpression(expression);
            expect(result).to.equal(23340);
        });
    });
});