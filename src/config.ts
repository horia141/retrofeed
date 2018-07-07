import { Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";

import { Env, parseEnv } from "./common";

export class ConfigService {

    public static fromFile(filePath: string): ConfigService {
        const envConfig = dotenv.parse(fs.readFileSync(filePath));
        return new ConfigService(envConfig);
    }

    private readonly envConfig: {[prop: string]: string};

    constructor(envConfig?: {[prop: string]: string}) {
        this.envConfig = envConfig || {};
    }

    public get env(): Env {
        // tslint:disable:no-string-literal
        return parseEnv(this.envConfig["ENV"]);
    }

    public get port(): number {
        // tslint:disable:no-string-literal
        return parseInt(this.envConfig["PORT"], 10);
    }
}

@Module({
    providers: [{
        provide: ConfigService,
        useValue: ConfigService.fromFile(".env"),
    }],
    exports: [ConfigService],
})
export class ConfigModule {}
