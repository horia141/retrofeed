import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import "mocha";
import * as moment from "moment";

import { AppController, AppModule } from "../../src/controllers/app/app";
import { ConfigTestingModule } from "../../src/infra/config";

describe("AppController", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, ConfigTestingModule],
        }).compile();
    });

    describe("root", () => {
        it.skip("should work", async () => {
            const appController = module.get<AppController>(AppController);

            expect(await appController.home({
                sessionID: "FOO",
                requestId: "BAR",
                requestTime: moment.utc(),
            } as any)).to.be.eql({
                canonicalPath: "/",
                language: "en",
                title: "RetroFeed",
                description: "Stay up to date with the latest changes in your project's dependencies",
                externalOrigin: "https://retrofeed.io",
                seoKeywords: ["retrofeed", "feed", "developer"],
                contactAuthors: "The RetroFeed Team",
                style: {
                    primaryColor: "#FE5D44",
                    webmanifestBackgroundColor: "#FAFAFA",
                    browserconfigTileColor: "#DA532C",
                },
                content: "Hello FOO - BAR",
                layout: "app/layout",
            });
        });
    });
});
