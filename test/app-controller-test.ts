import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import "mocha";
import * as moment from "moment";

import { AppController } from "../src/app-controller";
import { AppModule } from "../src/app-module";
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
            const appController = module.get<AppController>(AppController);

            expect(await appController.home({
                sessionID: "FOO",
                requestId: "BAR",
                requestTime: moment.utc(),
            } as any)).to.be.eql({
                title: "RetroFeed",
                content: "Hello FOO - BAR",
            });
        });
    });
});
