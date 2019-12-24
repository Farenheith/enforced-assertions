import { before, beforeEach, afterEach, after } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';

let stubEnforced = false;
let stubs: Array<[sinon.SinonStubbedInstance<any>, boolean]>;

export function enforceStubsAssertions() {
	let stubBackup: typeof sinon.stub;
	let expectBackup: any;

	before(() => {
		if (stubEnforced) {
			throw new Error('Stubs already enforced!');
		}
		stubEnforced = true;
		stubBackup = sinon.stub;
		(sinon as any).stub = (...params: any[]) => {
			const result = (stubBackup as any)(...params);
			stubs.push([result, false]);
			for (const method in result) {
				if (result.hasOwnProperty(method)) {
					const action = result[method];
					if (typeof action === 'function') {
						result[method] = (...params: any[]) => {
							// tslint:disable-next-line: triple-equals
							const stubIndex = stubs.findIndex(x => x[0] == result);
							if (stubIndex >= 0) {
								stubs[stubIndex][1] = true;
							}
							return action(...params);
						};
					}
				}
			}
			return result;
		};
		expectBackup = {};
		for (const method in sinon.assert) {
			if (sinon.assert.hasOwnProperty(method)) {
				expectBackup[method] = sinon.assert[method];
				sinon.assert[method] = (stub: sinon.SinonStub, ...params: any[]) => {
					// tslint:disable-next-line: triple-equals
					const stubIndex = stubs.findIndex(x => x[0] == stub);
					if (stubIndex >= 0) {
						stubs[stubIndex][1] = true;
					}
					return expectBackup[method](stub, ...params);
				};
			}
		}
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
		for (const method in expectBackup) {
			if (expectBackup.hasOwnProperty(method)) {
				(sinon.assert as any)[method] = expectBackup[method];
			}
		}
		stubEnforced = false;
	});
}
