import { Global, Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";

import { Env, parseEnv } from "./common";

export class Config {

    public static fromFile(filePath: string): Config {
        const envConfig = dotenv.parse(fs.readFileSync(filePath));
        return new Config(envConfig);
    }

    /**
     * In tests, an _empty_ config will be generated. Tests will have to
     * fake the calls to various config values, just like they'd do for
     * other dependencies.
     */
    public static forTesting(): Config {
        return new Config({});
    }

    private readonly envConfig: { [prop: string]: string };

    constructor(envConfig?: { [prop: string]: string }) {
        this.envConfig = envConfig || {};
    }

    public get env(): Env {
        // tslint:disable:no-string-literal
        return parseEnv(this.envConfig["ENV"]);
    }

    public get host(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["HOST"];
    }

    public get port(): number {
        // tslint:disable:no-string-literal
        const port = parseInt(this.envConfig["PORT"], 10);
        if (!Number.isSafeInteger(port)) {
            throw new Error(`Invalid port value ${this.envConfig["PORT"]}`);
        }
        return port;
    }

    public get sessionSecret(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["SESSION_SECRET"];
    }

    public get postgres(): IPostgresConfig {
        // tslint:disable:no-string-literal
        const config = {
            host: this.envConfig["POSTGRES_HOST"],
            port: parseInt(this.envConfig["POSTGRES_PORT"], 10),
            database: this.envConfig["POSTGRES_DATABASE"],
            username: this.envConfig["POSTGRES_USERNAME"],
            password: this.envConfig["POSTGRES_PASSWORD"],
        };

        if (!Number.isSafeInteger(config.port)) {
            throw new Error(`Invalid Postgres port value ${this.envConfig["POSTGRES_PORT"]}`);
        }

        return config;
    }
}

export interface IPostgresConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

@Global()
@Module({
    providers: [{
        provide: Config,
        useValue: Config.fromFile(".env"),
    }],
    exports: [Config],
})
export class ConfigModule { }

@Global()
@Module({
    providers: [{
        provide: Config,
        useValue: Config.forTesting(),
    }],
    exports: [Config],
})
export class ConfigTestingModule { }
