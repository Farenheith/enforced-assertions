"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const sinon = require("sinon");
const chai_1 = require("chai");
const chai = require("chai");
let stubEnforced = false;
let stubs;
function enforceStubsAssertions() {
    let stubBackup;
    let expectBackup;
    if (stubEnforced) {
        throw new Error('Stubs already enforced!');
    }
    stubEnforced = true;
    mocha_1.before(() => {
        stubBackup = sinon.stub;
        sinon.stub = (...params) => {
            const result = stubBackup(...params);
            stubs.push([result, false]);
            return result;
        };
        expectBackup = chai.expect;
        chai.expect = (stub) => {
            // tslint:disable-next-line: triple-equals
            const stubIndex = stubs.findIndex(x => x[0] == stub);
            if (stubIndex >= 0) {
                stubs[stubIndex][1] = true;
            }
            return expectBackup(stub);
        };
    });
    mocha_1.beforeEach(() => {
        stubs = [];
    });
    mocha_1.afterEach(() => {
        for (const stub of stubs) {
            chai_1.expect(stub[1]).to.be
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