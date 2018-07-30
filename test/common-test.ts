import { expect } from "chai";
import "mocha";

import {
    Env,
    envToString,
    isForDevelopment,
    isLocal,
    isNotOnServer,
    isOnServer,
    parseEnv,
} from "../src/infra/common";

describe("Env", () => {
    describe("parseEnv", () => {
        it("should parse local", () => {
            expect(parseEnv("LOCAL")).to.equal(Env.Local);
            expect(parseEnv("local")).to.equal(Env.Local);
            expect(parseEnv("lOcAl")).to.equal(Env.Local);
        });

        it("should parse test", () => {
            expect(parseEnv("TEST")).to.equal(Env.Test);
            expect(parseEnv("test")).to.equal(Env.Test);
            expect(parseEnv("tEsT")).to.equal(Env.Test);
        });

        it("should parse staging", () => {
            expect(parseEnv("STAGING")).to.equal(Env.Staging);
            expect(parseEnv("staging")).to.equal(Env.Staging);
            expect(parseEnv("sTaGiNg")).to.equal(Env.Staging);
        });

        it("should parse live", () => {
            expect(parseEnv("LIVE")).to.equal(Env.Live);
            expect(parseEnv("live")).to.equal(Env.Live);
            expect(parseEnv("lIvE")).to.equal(Env.Live);
        });

        it("should throw on undefined", () => {
            expect(() => parseEnv(undefined)).to.throw("Environment is not defined");
        });

        it("should throw on unknown environment", () => {
            expect(() => parseEnv("DEV")).to.throw("Invalid environment DEV");
        });
    });

    describe("envToString", () => {
        it("should convert local", () => {
            expect(envToString(Env.Local)).to.equal("LOCAL");
        });

        it("should convert test", () => {
            expect(envToString(Env.Test)).to.equal("TEST");
        });

        it("should convert stating", () => {
            expect(envToString(Env.Staging)).to.equal("STAGING");
        });

        it("should convert live", () => {
            expect(envToString(Env.Live)).to.equal("LIVE");
        });
    });

    describe("parseEnv is the opposite of envToString", () => {
        it("should be the case for local", () => {
            expect(envToString(parseEnv("LOCAL"))).to.equal("LOCAL");
            expect(parseEnv(envToString(Env.Local))).to.equal(Env.Local);
        });

        it("should be the case for test", () => {
            expect(envToString(parseEnv("TEST"))).to.equal("TEST");
            expect(parseEnv(envToString(Env.Test))).to.equal(Env.Test);
        });

        it("should be the case for staging", () => {
            expect(envToString(parseEnv("STAGING"))).to.equal("STAGING");
            expect(parseEnv(envToString(Env.Staging))).to.equal(Env.Staging);
        });

        it("should be the case for live", () => {
            expect(envToString(parseEnv("LIVE"))).to.equal("LIVE");
            expect(parseEnv(envToString(Env.Live))).to.equal(Env.Live);
        });
    });

    describe("isLocal", () => {
        it("should recognize local as local", () => {
            expect(isLocal(Env.Local)).to.equal(true);
        });

        it("should recognize test as non-local", () => {
            expect(isLocal(Env.Test)).to.equal(false);
        });

        it("should recognize staging as non-local", () => {
            expect(isLocal(Env.Staging)).to.equal(false);
        });

        it("should recognize live as non-local", () => {
            expect(isLocal(Env.Live)).to.equal(false);
        });
    });

    describe("isForDevelopment", () => {
        it("should recognize local for development", () => {
            expect(isForDevelopment(Env.Local)).to.equal(true);
        });

        it("should recognize test for development", () => {
            expect(isForDevelopment(Env.Test)).to.equal(true);
        });

        it("should recognize staging for development", () => {
            expect(isForDevelopment(Env.Staging)).to.equal(true);
        });

        it("should recognize live as not for development", () => {
            expect(isForDevelopment(Env.Live)).to.equal(false);
        });
    });

    describe("isNotOnServer", () => {
        it("should recognize local as not on server", () => {
            expect(isNotOnServer(Env.Local)).to.equal(true);
        });

        it("should recognize test as not on server", () => {
            expect(isNotOnServer(Env.Test)).to.equal(true);
        });

        it("should recognize staging as on server", () => {
            expect(isNotOnServer(Env.Staging)).to.equal(false);
        });

        it("should recognize live as server", () => {
            expect(isNotOnServer(Env.Live)).to.equal(false);
        });
    });

    describe("isOnServer", () => {
        it("should recognize local as not on server", () => {
            expect(isOnServer(Env.Local)).to.equal(false);
        });

        it("should recognize test as not on server", () => {
            expect(isOnServer(Env.Test)).to.equal(false);
        });

        it("should recognize staging as on server", () => {
            expect(isOnServer(Env.Staging)).to.equal(true);
        });

        it("should recognize live as server", () => {
            expect(isOnServer(Env.Live)).to.equal(true);
        });
    });
});
