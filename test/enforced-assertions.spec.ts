import { enforceStubsAssertions } from '../src/enforced-assertions';
import * as sinon from 'sinon';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';

describe('enforced-assertions.spec.ts', () => {
	describe('enforceStubsAssertions()', () => {
		enforceStubsAssertions();
		let stub: sinon.SinonStub;

		beforeEach(() => {
			stub = sinon.stub();
		});

		it('should check for 1 stub', () => {
			expect(stub).to.have.not.been.called;
			sinon.assert.callCount(stub, 0);
		});

		it('should check for 2 stub', () => {
			const stub2 = sinon.stub();
			expect(stub).to.have.not.been.called;
			expect(stub2).to.have.not.been.called;
		});
	});
});
