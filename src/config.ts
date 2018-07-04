import { Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";

import { Env, parseEnv } from "./common";

export class ConfigService {
    private readonly envConfig: {[prop: string]: string};

    constructor(filePath: string) {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }

    public get env(): Env {
        return parseEnv(this.envConfig["ENV"]);
    }

    public get port(): number {
        return parseInt(this.envConfig["PORT"], 10);
    }
}

@Module({
    providers: [{
        provide: ConfigService,
        useValue: new ConfigService(".env")
    }],
    exports: [ConfigService],
})
export class ConfigModule {}
