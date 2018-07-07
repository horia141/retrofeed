import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import "mocha";
import * as sinon from "sinon";

import { AppModule } from "../src/app-module";
import { AppService } from "../src/app-service";
import { Env } from "../src/common";
import { ConfigService } from "../src/config";

describe("AppService", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    describe("root", () => {
        it("should work", () => {
            const configService = module.get(ConfigService);
            const appService = module.get(AppService);

            sinon.replaceGetter(configService, "env", () => Env.Test);

            expect(appService.root()).to.be.eql("Hello World - TEST");
        });
    });
});
