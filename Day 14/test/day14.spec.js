const expect = require("chai").expect;
const sinon = require("sinon");
//const Mocha = require("mocha");

const Day14Solver = require("../src/day14").Day14Solver;
const initializationProgram = require("../src/day14").initializationProgram;

describe("-- Test class Day14Solver --", function() {
        describe.skip("** Solve first part **", function() {
            let solver;
            before(function() {
                solver = new Day14Solver(initializationProgram);
            });

            it.skip("check mask against value 1011 - must return 000000000000000000000000000001001001", function() {
                var shiftBitsProxy = sinon.spy(solver, "shiftBits");
                var convertToBase2Proxy = sinon.spy(solver, "convertToBase2");
                solver.solveFirstPart();

                expect(convertToBase2Proxy.firstCall.returnValue, "convert 11 to base 2").to.equal("1011");

                expect(shiftBitsProxy.getCall(0).firstArg).to.equal("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X");
                expect(shiftBitsProxy.getCall(0).lastArg).to.equal("1011");
                expect(shiftBitsProxy.getCall(0).returnValue).to.equal("000000000000000000000000000001001001");
            });

            it("run solver - first part", function() {
                solver.solveFirstPart();
                expect(solver.maskedBits[0]).to.equal("000000000000000000000000000001001001");
                expect(solver.maskedBits[1]).to.equal("000000000000000000000000000001100101");
                expect(solver.maskedBits[2]).to.equal("000000000000000000000000000001000000");
            });

            it("solver.mem must have elements", function() {
                expect(solver.mem.length).to.be.greaterThan(0);                
            });

            it("mem[7] must be equal to 101", function() {
                expect(solver.mem.find(value => value[0] === "7")[1], "mem[7]").to.equal(101);
            });
            
            it("mem[8] must be equal to 64", function() {
                expect(solver.mem.find(value => value[0] === "8")[1], "mem[8]").to.equal(64);
            });

            it("sum of values in mem array must be 165", function() {
                const result = solver.mem.reduce((acc, curr) => acc + curr[1], 0);
                expect(result, "sum of all non-zero values in mem").to.equal(165);
            });
        });

        describe("** Solve second part **", function() {
            let solver;
            let result = 0;
            before(function() {
                solver = new Day14Solver(initializationProgram);
            });

            let applyAddressMaskProxy;
            it("run solver for second part", function() {
                applyAddressMaskProxy = sinon.spy(solver, "applyAddressMask");
                result = solver.solveSecondPart();
            });

            it("check first masked address must be 000000000000000000000000000000X1101X", function() {
                expect(solver.maskedBits[0]).to.equal("000000000000000000000000000000X1101X");
            });

            it("check last masked address must be 00000000000000000000000000000001X0XX", function() {
                expect(solver.maskedBits[solver.maskedBits.length - 1]).to.equal("00000000000000000000000000000001X0XX");
            });

            it("applyAddressMask() must be called a total of 12 times", function() {
                expect(applyAddressMaskProxy.callCount).to.equal(12);
            });
                                                                
            it("first address after applying first mask must be 000000000000000000000000000000011010", function() {
                expect(applyAddressMaskProxy.firstCall.returnValue).to.equal("000000000000000000000000000000011010");
            });

            it("mem array must have 10 elements", function() {
                expect(solver.mem.length).to.equal(10);
            });

            it("sum of values in mem array must be 208", function() {
                expect(result).to.equal(208);
            })
        });
    }
);