import * as sinon from 'sinon';
import { afterEach } from 'mocha';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

afterEach(() => {
	sinon.restore();
})
