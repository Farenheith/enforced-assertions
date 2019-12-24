import { before, beforeEach, afterEach, after } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import * as chai from 'chai';

let stubEnforced = false;
let stubs: Array<[sinon.SinonStubbedInstance<any>, boolean]>;

export function enforceStubsAssertions() {
	let stubBackup: typeof sinon.stub;
	let expectBackup: typeof chai.expect;

	before(() => {
		if (stubEnforced) {
			throw new Error('Stubs already enforced!');
		}
		stubEnforced = true;
		stubBackup = sinon.stub;
		(sinon as any).stub = (...params: any[]) => {
			const result = (stubBackup as any)(...params);
			stubs.push([result, false]);
			return result;
		};
		expectBackup = chai.expect;
		(chai as any).expect = (stub: sinon.SinonStub) => {
			// tslint:disable-next-line: triple-equals
			const stubIndex = stubs.findIndex(x => x[0] == stub);
			if (stubIndex >= 0) {
				stubs[stubIndex][1] = true;
			}
			return expectBackup(stub);
		};
	});

	beforeEach(() => {
		stubs = [];
	});

	afterEach(() => {
		for (const stub of stubs) {
			expect(stub[1]).to.be
				.eq(true, `Expected stub ${stub[0]} to have been tested`);
		}
		stubs.length = 0;
	});

	after(() => {
		(sinon as any).stub = stubBackup;
		(chai as any).expect = expectBackup;
		stubEnforced = false;
	});
}
