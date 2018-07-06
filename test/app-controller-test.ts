import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import * as sinon from "sinon";

import { AppController } from "../src/app-controller";
import { AppService } from "../src/app-service";
import { ConfigService } from "../src/config";

describe("AppController", () => {
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

    describe("root", () => {
        it("should workd", async () => {
            const appService = new AppService(configService);
            const appController = new AppController(appService);

            const fake = sinon.fake.returns("Hello World - TEST");
            sandbox.replace(appService, 'root', fake);

            expect(await appController.root()).to.be.eql("Hello World - TEST");
        });
    });
});
