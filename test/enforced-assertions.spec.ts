import { enforceStubsAssertions } from '../src/enforced-assertions';
import * as sinon from 'sinon';
import * as chai from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

describe('enforced-assertions.spec.ts', () => {
	describe('enforceStubsAssertions()', () => {
		enforceStubsAssertions(sinon, chai);
		let stub: sinon.SinonStub;
		let error: Error;
		try {
			enforceStubsAssertions(sinon, chai);
		} catch (err) {
			error = err;
		}

		beforeEach(() => {
			stub = sinon.stub();
		});

		it('should check for 1 stub', () => {
			expect(stub).to.have.not.been.called;
			sinon.assert.callCount(stub, 0);
			expect(error!).to.be.instanceOf(Error);
		});

		it('should check for 2 stub', () => {
			const stub2 = sinon.stub();
			expect(stub).to.have.not.been.called;
			expect(stub2).to.have.not.been.called;
			expect(error!).to.be.instanceOf(Error);
		});
	});
});
