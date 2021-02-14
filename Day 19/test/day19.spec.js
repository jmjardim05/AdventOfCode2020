const expect = require("chai").expect;
const messages = require("../src/day19").messages;
const Day19Solver = require("../src/day19").Day19Solver;

describe.skip("-- Test getRules() and createRegExpFor() functions --", function() {
    describe("** test getRules() **", function() {
        it("getRules() must return only rules", function() {
            // const rules = getRules(messages);
            expect(rules.length).to.equal(6);
        });
    });

    describe("** test createRegExpFor() **", function() {
        it("createRegExpFor() must return a((aa|bb)(ab|ba)|(ab|ba)(aa|bb))b", function() {
            // const rules = getRules(messages);
            // const expr = createRegExpFor("0", rules);
            expect(expr).to.equal("a((aa|bb)(ab|ba)|(ab|ba)(aa|bb))b");
        });
    });
});

describe("-- Test Day19Solver class --", function() {
    let solver;
    before(function() {
        solver = new Day19Solver(messages);
    });

    describe.skip("** check to see if getRules() and createRegExpFor() stiil return correctly **", function() {
        it("getRules() must return only rules", function() {
            const rules = solver.rules;
            expect(rules.length).to.equal(6);
        });

        it("createRegExpFor() must return a((aa|bb)(ab|ba)|(ab|ba)(aa|bb))b", function() {
            const expr = solver.createRegExpFor("0", solver.rules);
            expect(expr).to.equal("a((aa|bb)(ab|ba)|(ab|ba)(aa|bb))b");
        });
    });

    describe("** run solver - First part - test input **", function() {
        it.only("messages last item must be bbaabbbababaababbbbbabbb", function(){
            const msg = solver.messages[solver.messages.length - 1];
            expect(msg).to.equal("bbaabbbababaababbbbbabbb");
        })

        it("result must equal 2", function(){
            const result = solver.solveFirstPart();
            expect(result).to.equal(2);
        });
    });
});