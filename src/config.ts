import { Global, Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";

import { Env, parseEnv } from "./common";

export class ConfigService {

    public static fromFile(filePath: string): ConfigService {
        const envConfig = dotenv.parse(fs.readFileSync(filePath));
        return new ConfigService(envConfig);
    }

    /**
     * In tests, an _empty_ config will be generated. Tests will have to
     * fake the calls to various config values, just like they'd do for
     * other dependencies.
     */
    public static forTesting(): ConfigService {
        return new ConfigService({});
    }

    private readonly envConfig: { [prop: string]: string };

    constructor(envConfig?: { [prop: string]: string }) {
        this.envConfig = envConfig || {};
    }

    public get env(): Env {
        // tslint:disable:no-string-literal
        return parseEnv(this.envConfig["ENV"]);
    }

    public get port(): number {
        // tslint:disable:no-string-literal
        const port = parseInt(this.envConfig["PORT"], 10);
        if (!Number.isSafeInteger(port)) {
            throw new Error(`Invalid port value ${this.envConfig["PORT"]}`);
        }
        return port;
    }
}

@Global()
@Module({
    providers: [{
        provide: ConfigService,
        useValue: ConfigService.fromFile(".env"),
    }],
    exports: [ConfigService],
})
export class ConfigModule { }

@Global()
@Module({
    providers: [{
        provide: ConfigService,
        useValue: ConfigService.forTesting(),
    }],
    exports: [ConfigService],
})
export class ConfigTestingModule { }
