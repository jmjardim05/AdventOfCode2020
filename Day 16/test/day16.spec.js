const expect = require("chai").expect;
const sinon = require("sinon");

const Day16Solver = require("../src/day16").Day16Solver;
const tickets = require("../src/day16").tickets;

describe("*** Test Day 16 ***", function() {
    let solver = new Day16Solver(tickets);

    describe.skip("-- creation of solver class ---", function () {
        it("check if 'rules' array have 3 items", function() {
            expect(solver.rules.length).to.equal(3);
        });

        it("check if 'tickets' array have 4 items", function() {
            expect(solver.tickets.length).to.equal(4);
        });
    });

    describe.skip("-- consolidate rules --", function() {
        let consolidateRules = [];
        before(function() {
            consolidateRules = solver.consolidateRules();
        });

        it("check first rule to equal 1-3", function() {
            expect(consolidateRules[0]).to.equal("1-3");
        });

        it("check last rule to equal 45-50", function() {
            expect(consolidateRules[consolidateRules.length - 1]).to.equal("45-50");
        });
    });

    describe.skip("-- check ranges of indivudal rules --", function() {
        let consolidateRules = [];
        before(function() {
            consolidateRules = solver.consolidateRules();
        });

        it("first ticket, first value (7), first rule (1-3) is false", function() {
            expect(solver.inRuleValueRange(Number.parseInt(solver.tickets[0]), consolidateRules[0])).to.be.false;
        });

        it("first ticket, first value (7), next rule (5-7) is true", function() {
            expect(solver.inRuleValueRange(Number.parseInt(solver.tickets[0]), consolidateRules[1])).to.equal(1);
        });
    });

    describe.skip("-- check for valid tickets and error rate --", function() {
        let consolidateRules = [];
        before(function() {
            consolidateRules = solver.consolidateRules();
        });

        it("first ticket is valid", function() {
            solver.validateTicket(solver.tickets[0], consolidateRules);
            expect(solver.errorRate).to.equal(0);
        });

        it("second ticket is invalid, error rate is 4", function() {
            solver.validateTicket(solver.tickets[1], consolidateRules);
            expect(solver.errorRate).to.equal(4);
        });

        it("third ticket is invalid, error rate is 59", function() {
            solver.validateTicket(solver.tickets[2], consolidateRules);
            expect(solver.errorRate).to.equal(59);
        });

        it("fourth ticket is invalid, error rate is 71", function() {
            solver.validateTicket(solver.tickets[3], consolidateRules);
            expect(solver.errorRate).to.equal(71);
        });
    });

    describe.skip("-- run solver - first part - test input --", function() {
        it("solver must return 71 (error rate)", function() {
            expect(solver.solveFirstPart()).to.equal(71);
        });
    });

    describe("-- second part determine fields, run solver for final input --", function() {
        it.skip("order of fields must be row, class and seat", function() {
            const fields = solver.determineFields();
            expect(fields.length).to.equal(3);
            expect(fields[0]).to.equal(1);
            expect(fields[1]).to.equal(0);
            expect(fields[2]).to.equal(2);
        });

        it.skip("class = 12, row = 11 and seat = 13", function() {
            const fields = solver.determineFields();
            expect(solver.yourTicket[fields[0]]).to.equal("12");
            expect(solver.yourTicket[fields[1]]).to.equal("11");
            expect(solver.yourTicket[fields[2]]).to.equal("13");
        });

        it("after call to solveFirstPart() tickets must have less items", function() {
            const ticketCount = solver.tickets.length;
            solver.solveFirstPart();
            expect(solver.tickets.length).to.be.lessThan(ticketCount);
        });

        it("multiplyDepartureValue must be called 6 times (excuse to use sinonJS)", function() {
            const multiplyDepartureValueProxy = sinon.spy(solver, "multiplyDepartureValue");            
            const result = solver.solveSecondPart();
            expect(multiplyDepartureValueProxy.callCount).to.equal(6);
            expect(result).to.be.greaterThan(1);
        });
    });
});