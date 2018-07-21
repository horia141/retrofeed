import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import * as express from "express";
import "mocha";
import * as sinon from "sinon";

import { AppController } from "../src/app-controller";
import { AppModule } from "../src/app-module";
import { AppService } from "../src/app-service";
import { ConfigTestingModule } from "../src/config";

describe("AppController", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, ConfigTestingModule],
        }).compile();
    });

    describe("root", () => {
        it("should work", async () => {
            const appService = module.get<AppService>(AppService);
            const appController = module.get<AppController>(AppController);

            const fake = sinon.fake.returns("Hello World - TEST");
            sinon.replace(appService, "root", fake);

            expect(await appController.root({sessionID: "FOO", requestId: "BAR"} as express.Request))
                .to.be.eql("Hello World - TEST - FOO - BAR");
        });
    });
});
