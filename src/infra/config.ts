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

    public get version(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["VERSION"];
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

    public get applicationName(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["APPLICATION_NAME"];
    }

    public get externalOrigin(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["EXTERNAL_ORIGIN"];
    }

    public get contact(): ContactConfig {
        // tslint:disable:no-string-literal
        return {
            authors: "The RetroFeed Team",
            email: this.envConfig["CONTACT_EMAIL"],
        };
    }

    public get defaultLanguage(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["DEFAULT_LANGUAGE"];
    }

    public get seo(): SeoConfig {
        return {
            keywords: ["retrofeed", "feed", "developer"],
        };
    }

    public get style(): StyleConfig {
        return {
            primaryColor: "#FE5D44",
            webmanifestBackgroundColor: "#FAFAFA",
            browserconfigTileColor: "#DA532C",
        };
    }

    public get sessionSecret(): string {
        // tslint:disable:no-string-literal
        return this.envConfig["SESSION_SECRET"];
    }

    public get postgres(): PostgresConfig {
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

    public get auth0(): Auth0Config {
        // tslint:disable:no-string-literal
        return {
            domain: this.envConfig["AUTH0_DOMAIN"],
            clientId: this.envConfig["AUTH0_CLIENT_ID"],
            clientSecret: this.envConfig["AUTH0_CLIENT_SECRET"],
        };
    }
}

export interface ContactConfig {
    authors: string;
    email: string;
}

export interface SeoConfig {
    keywords: string[];
}

export interface StyleConfig {
    primaryColor: string;
    webmanifestBackgroundColor: string;
    browserconfigTileColor: string;
}

export interface PostgresConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface Auth0Config {
    domain: string;
    clientId: string;
    clientSecret: string;
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
