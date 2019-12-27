"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enforced_assertions_1 = require("../src/enforced-assertions");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
mocha_1.describe('enforced-assertions.spec.ts', () => {
    mocha_1.describe('enforceStubsAssertions()', () => {
        enforced_assertions_1.enforceStubsAssertions();
        let stub;
        mocha_1.beforeEach(() => {
            stub = sinon.stub();
        });
        mocha_1.it('should check for 1 stub', () => {
            chai_1.expect(stub).to.have.not.been.called;
            sinon.assert.callCount(stub, 0);
        });
        mocha_1.it('should check for 2 stub', () => {
            const stub2 = sinon.stub();
            chai_1.expect(stub).to.have.not.been.called;
            chai_1.expect(stub2).to.have.not.been.called;
        });
    });
});
//# sourceMappingURL=enforced-assertions.spec.js.map