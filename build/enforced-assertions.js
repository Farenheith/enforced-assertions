"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
let stubEnforced = false;
function enforceStubsAssertions() {
    let stubBackup;
    let expectBackup;
    let stubs;
    mocha_1.before(() => {
        if (stubEnforced) {
            throw new Error('Stubs already enforced!');
        }
        stubEnforced = true;
        stubBackup = sinon.stub;
        expectBackup = chai.expect;
    });
    beforeEach(() => {
        stubs = [];
        sinon.stub = (...params) => {
            const result = stubBackup(params);
            stubs.push([result, false]);
        };
        chai.expect = (stub, ...params) => {
            // tslint:disable-next-line: triple-equals
            const stubIndex = stubs.findIndex(x => x[0] == stub);
            if (stubIndex >= 0) {
                stubs[stubIndex][1] = true;
            }
        };
    });
    mocha_1.afterEach(() => {
        for (const stub of stubs) {
            expectBackup(stubs[1]).to.be
                .eq(true, `Expected stub ${stub[0]} to have been tested`);
        }
        stubs.length = 0;
    });
    mocha_1.after(() => {
        sinon.stub = stubBackup;
        chai.expect = expectBackup;
        stubEnforced = false;
    });
}
exports.enforceStubsAssertions = enforceStubsAssertions;
//# sourceMappingURL=enforced-assertions.js.map