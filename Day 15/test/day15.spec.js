const expect = require("chai").expect;

const Day15Solver = require("../src/day15")

describe("-- Test Solution for Day 15 --", function() {
    describe.skip("** Solve Part 1 - Test Input **", function() {
        let solver;
        before(function() {
            solver = new Day15Solver([0, 3, 6]);
        });

        it("run first turn, it must return last spoken 0 and turn 1", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[0]).to.equal(0);
            expect(lastSpoken.length).to.equal(1);
        });

        it("run second turn, it must return last spoken 3 and turn 2", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(3);
            expect(lastSpoken.length).to.equal(2);
        });

        it("run third turn, it must return last spoken 6 and turn 3", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(6);
            expect(lastSpoken.length).to.equal(3);
        });

        it("run fourth turn, it must return last spoken 0 and turn 4", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(0);
            expect(lastSpoken.length).to.equal(4);
        });

        it("run fifth turn, it must return last spoken 3 and turn 5", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(3);
            expect(lastSpoken.length).to.equal(5);
        });

        it("run sixth turn, it must return last spoken 3 and turn 6", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(3);
            expect(lastSpoken.length).to.equal(6);
        });

        it("run seventh turn, it must return last spoken 1 and turn 7", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(1);
            expect(lastSpoken.length).to.equal(7);
        });

        it("run eighth turn, it must return last spoken 0 and turn 8", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(0);
            expect(lastSpoken.length).to.equal(8);
        });

        it("run ninth turn, it must return last spoken 4 and turn 9", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(4);
            expect(lastSpoken.length).to.equal(9);
        });

        it("run tenth turn, it must return last spoken 0 and turn 10", function() {
            const lastSpoken = solver.playNextTurn();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(0);
            expect(lastSpoken.length).to.equal(10);
        });

        it("run solver - must return last spoken 436 and turn 2020", function() {
            const lastSpoken = solver.solveFirstPart();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(436);
            expect(lastSpoken.length).to.equal(2020);
        });
    });

    describe("** Solve Part 1 - Test Input with playNextTurn3 **", function() {
        let solver;
        before(function() {
            solver = new Day15Solver([0, 3, 6]);
        });

        it("run first turn, it must return last spoken 0 and turn 1", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[0]).to.equal(0);
            expect(solver.lastSpoken.length).to.equal(1);
        });

        it("run second turn, it must return last spoken 3 and turn 2", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(3);
            expect(solver.lastSpoken.length).to.equal(2);
        });

        it("run third turn, it must return last spoken 6 and turn 3", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(6);
            expect(solver.lastSpoken.length).to.equal(3);
        });

        it("run fourth turn, it must return last spoken 0 and turn 4", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(0);
            expect(solver.lastSpoken.length).to.equal(4);
        });

        it("run fifth turn, it must return last spoken 3 and turn 5", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(3);
            expect(solver.lastSpoken.length).to.equal(5);
        });

        it("run sixth turn, it must return last spoken 3 and turn 6", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(3);
            expect(solver.lastSpoken.length).to.equal(6);
        });

        it("run seventh turn, it must return last spoken 1 and turn 7", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(1);
            expect(solver.lastSpoken.length).to.equal(7);
        });

        it("run eighth turn, it must return last spoken 0 and turn 8", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(0);
            expect(solver.lastSpoken.length).to.equal(8);
        });

        it("run ninth turn, it must return last spoken 4 and turn 9", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(4);
            expect(solver.lastSpoken.length).to.equal(9);
        });

        it("run tenth turn, it must return last spoken 0 and turn 10", function() {
            solver.playNextTurn3();
            expect(solver.lastSpoken[solver.lastSpoken.length - 1]).to.equal(0);
            expect(solver.lastSpoken.length).to.equal(10);
        });

        it.only("run solver - must return last spoken 436 and turn 2020", function() {
            const lastSpoken = solver.solveFirstPart();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(436);
            expect(lastSpoken.length).to.equal(2020);
        });
    });

    describe.skip("** Solve Part 2 - Test Input **", function() {
        let solver;
        before(function() {
            solver = new Day15Solver([0, 3, 6]);
        });

        it("run solver - must return last spoken 175594 and turn 30000000", function() {
            const lastSpoken = solver.solveSecondPart();
            expect(lastSpoken[lastSpoken.length - 1]).to.equal(175594);
            expect(lastSpoken.length).to.equal(30000000);
        });

        it("run solver - must return last spoken 175594 and turn 30000000", function() {
            const lastSpoken = solver.solveSecondPart();
            expect(lastSpoken[lastSpoken.length - 1][0]).to.equal(175594);
            expect(lastSpoken[lastSpoken.length - 1][1]).to.equal(30000000);
        });
    });
});