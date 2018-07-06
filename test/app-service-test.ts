import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import * as sinon from "sinon";

import { AppService } from "../src/app-service";
import { ConfigService } from "../src/config";

describe("AppService", () => {
    let sandbox: sinon.SinonSandbox;
    let configService: ConfigService;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(fs, "readFileSync").returns(`
ENV=TEST
PORT=10001
        `);
        configService = new ConfigService(".env");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be created", () => {
        const appService = new AppService(configService);

        expect(appService.root()).to.be.eql("Hello World - TEST");
    });
});
