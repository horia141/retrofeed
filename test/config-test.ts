import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import * as sinon from "sinon";

import { Env } from "../src/common";
import { ConfigService } from "../src/config";

describe("ConfigService", () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be constructed from a file", () => {
        sandbox.stub(fs, "readFileSync").returns(`
ENV=TEST
PORT=10001
        `);

        const configService = ConfigService.fromFile(".env");

        expect(configService.env).to.eql(Env.Test);
        expect(configService.port).to.eql(10001);
    });

    it("can be constructed for testing", () => {
        const configService = ConfigService.forTesting();

        expect(() => configService.env).to.throw();
        expect(() => configService.port).to.throw();
    });
});
