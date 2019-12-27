"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const mocha_1 = require("mocha");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
mocha_1.afterEach(() => {
    sinon.restore();
});
//# sourceMappingURL=setup.spec.js.map