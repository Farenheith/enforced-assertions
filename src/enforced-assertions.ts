import { before, beforeEach, afterEach, after } from 'mocha';
import { SinonSandbox } from 'sinon';

let stubEnforced = false;
let stubs: Array<[sinon.SinonStubbedInstance<object>, boolean]>;

export function enforceStubsAssertions(sinon: SinonSandbox, chai: Chai.ChaiStatic) {
	let stubBackup: typeof sinon.stub;
	let expectBackup: typeof chai.expect;
	if (stubEnforced) {
		throw new Error('Stubs already enforced!');
	}
	stubEnforced = true;

	before(() => {
		stubBackup = sinon.stub;
		(sinon as { stub: object }).stub = (...params: object[]) => {
			const result = (stubBackup as Function)(...params);
			stubs.push([result, false]);
			return result;
		};
		expectBackup = chai.expect;
		(chai as { expect: object }).expect = (stub: sinon.SinonStub) => {
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
			expectBackup(stub[1]).to.be
				.eq(true, `Expected stub ${stub[0]} to have been tested`);
		}
		stubs.length = 0;
	});

	after(() => {
		(sinon as { stub: object }).stub = stubBackup;
		(chai as { expect: object }).expect = expectBackup;
		stubEnforced = false;
	});
}
