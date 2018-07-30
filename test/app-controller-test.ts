import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import "mocha";
import * as moment from "moment";

import { AppController, AppModule } from "../src/controllers/app/app";
import { ConfigTestingModule } from "../src/infra/config";

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
