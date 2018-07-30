import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import * as sinon from "sinon";

import { Env } from "../src/infra/common";
import { Config } from "../src/infra/config";

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
POSTGRES_HOST=postgres.retrofeed
POSTGRES_PORT=10000
POSTGRES_DATABASE=retrofeed
POSTGRES_USERNAME=retrofeed
POSTGRES_PASSWORD=retrofeed
        `);

        const configService = Config.fromFile(".env");

        expect(configService.env).to.eql(Env.Test);
        expect(configService.port).to.eql(10001);
        expect(configService.postgres.host).to.eql("postgres.retrofeed");
        expect(configService.postgres.port).to.eql(10000);
        expect(configService.postgres.database).to.eql("retrofeed");
        expect(configService.postgres.username).to.eql("retrofeed");
        expect(configService.postgres.password).to.eql("retrofeed");
    });

    it("can be constructed for testing", () => {
        const configService = Config.forTesting();

        expect(() => configService.env).to.throw();
        expect(() => configService.port).to.throw();
        expect(() => configService.postgres).to.throw();
    });
});
