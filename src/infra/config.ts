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

    public get application(): ApplicationConfig {
        // TODO: some of these will need to be localized.
        return {
            name: "RetroFeed",
            description: "Stay up to date with the latest changes in your project's dependencies",
            externalOrigin: "https://retrofeed.io",
            authors: "The RetroFeed Team",
            contactEmail: "contact@retrofeed.io",
            defaultLanguage: "en",
            seoKeywords: ["retrofeed", "feed", "developer"],
            style: {
                primaryColor: "#FE5D44",
                webmanifestBackgroundColor: "#FAFAFA",
                browserconfigTileColor: "#DA532C",
                logoPath: "/real/client/assets/android-chrome-512x512.png",
            },
            facebookAppId: "NULL",
            twitterHandle: "NULL",
        };
    }

    public get wellKnownPaths(): WellKnownPathsConfig {
        return {
            homePath: "/",
            adminPrefix: "/admin",
            loginPath: "/real/auth/login",
            logoutPath: "/real/auth/logout",
        };
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

    public get webpackConfigPath(): string {
        return "../webpack.config.js";
    }
}

export interface ApplicationConfig {
    name: string;
    description: string;
    externalOrigin: string;
    authors: string;
    contactEmail: string;
    defaultLanguage: string;
    seoKeywords: string[];
    style: StyleConfig;
    facebookAppId: string;
    twitterHandle: string;
}

export interface WellKnownPathsConfig {
    homePath: string;
    adminPrefix: string;
    loginPath: string;
    logoutPath: string;
}

export interface StyleConfig {
    primaryColor: string;
    webmanifestBackgroundColor: string;
    browserconfigTileColor: string;
    logoPath: string;
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
