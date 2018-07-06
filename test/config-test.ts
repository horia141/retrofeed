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

    it("should expose expected values", () => {
        sandbox.stub(fs, "readFileSync").returns(`
ENV=TEST
PORT=10001
        `);

        const configService = new ConfigService(".env");

        expect(configService.env).to.eql(Env.Test);
        expect(configService.port).to.eql(10001);
    });
});
