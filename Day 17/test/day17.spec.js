const expect = require("chai").expect;

const Day17Solver = require("../src/day17").Day17Solver;
const initialState = require("../src/day17").initialState;

describe("*** Test Day17Solver class ***", function() {
    describe(" -- run a few cycles in the test input -- ", function() {
        let solver;
        let dimAfterNextCycle = [];
        before(function() {
            solver = new Day17Solver(initialState);
            dimAfterNextCycle = [ ...solver.dimension ];
        });

        // beforeEach(function() {
        //     dimAfterNextCycle = [ ...solver.expandSearchArea(dimAfterNextCycle) ];
        //     dimAfterNextCycle = solver.doCycle();            
        // });

        it("after 1 cycle z - 1 has active cubes in [(1,2), (2,4), (3,3)]", function() {            
            expect(dimAfterNextCycle[1][2][0]).to.equal("#");
            expect(dimAfterNextCycle[2][4][0]).to.equal("#");
            expect(dimAfterNextCycle[3][3][0]).to.equal("#");
            expect(dimAfterNextCycle.reduce((acc, curr) => {
                for (let i = 0; i < curr.length; i++) {
                        if (curr[i][0] === "#") {
                            acc++;
                        }
                }
                return acc;
            }, 0)).to.equal(3); // assert that the total of active cubes in z - 1 equals 3
        });

        it("after 2 cycles z - 2 has active cubes in [(3,2)]", function() {            
            expect(dimAfterNextCycle[2][3][0]).to.equal("#");
            expect(dimAfterNextCycle.reduce((acc, curr) => {
                for (let i = 0; i < curr.length; i++) {
                        if (curr[i][0] === "#") {
                            acc++;
                        }
                }
                return acc;
            }, 0)).to.equal(1); // assert that the total of active cubes in z - 2 equals 1
        });

        it("after 3 cycles z - 2 has active cubes in [(2,2), (2,3), (3,2), (3,3), (4,3)]", function() {            
            expect(dimAfterNextCycle[2][2][1]).to.equal("#");
            expect(dimAfterNextCycle[2][3][1]).to.equal("#");
            expect(dimAfterNextCycle[3][2][1]).to.equal("#");
            expect(dimAfterNextCycle[3][3][1]).to.equal("#");
            expect(dimAfterNextCycle[4][3][1]).to.equal("#");
            expect(dimAfterNextCycle.reduce((acc, curr) => {
                for (let i = 0; i < curr.length; i++) {
                        if (curr[i][1] === "#") {
                            acc++;
                        }
                }
                return acc;
            }, 0)).to.equal(5); // assert that the total of active cubes in z - 2 equals 5
        });

        it("cycle 4", function() {
            expect(true).to.be.true; // pass the test to simulate until cycle 6
        });

        it("cycle 5", function() {
            expect(true).to.be.true; // pass the test to simulate until cycle 6
        });

        it("after 6 cycles the total of active cubes is 112", function() {
            expect(dimAfterNextCycle.reduce((acc, curr) => {
                for (let i = 0; i < curr.length; i++) {
                    for (let j = 0; j < curr[i].length; j++) {
                        if (curr[i][j] === "#") {
                            acc++;
                        }
                    }
                }
                return acc;
            }, 0)).to.equal(112); 
        });

        it.only("run solver, for test input must return 112", function() {
            expect(solver.solveFirstPart()).to.equal(112); 
        });
    });
})