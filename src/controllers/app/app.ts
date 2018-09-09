import { Controller, Get, Module, Render, Req, UseGuards } from "@nestjs/common";
import * as express from "express";
import * as serializeJavascript from "serialize-javascript";

import { MarshalFrom } from "../../../node_modules/raynor";
import { ViewAuthGuard } from "../../auth/auth";
import { ClientConfig, ClientState, User as ClientUser } from "../../client/shared";
import { ApplicationConfig, Config } from "../../infra/config";
import { User } from "../../services/user/entities";

@Controller("/")
export class AppController {

    private static readonly clientConfigMarshaller = new (MarshalFrom(ClientConfig))();
    private static readonly clientStateMarshaller = new (MarshalFrom(ClientState))();

    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    @Get("/")
    @Render("app/app")
    public async home(@Req() req: express.Request): Promise<BasicViewResponse> {
        return {
            applicationConfig: this.config.application,
            clientConfigSer: this.prepareClientConfigSer(),
            clientStateSer: this.prepareClientStateSer(req.user ? (req.user as User) : null),
        };
    }

    @Get("/admin")
    @Render("app/app")
    @UseGuards(ViewAuthGuard)
    public async admin(@Req() req: express.Request): Promise<BasicViewResponse> {
        return {
            applicationConfig: this.config.application,
            clientConfigSer: this.prepareClientConfigSer(),
            clientStateSer: this.prepareClientStateSer(req.user as User),
        };
    }

    private prepareClientConfigSer(): string {
        const clientConfig = new ClientConfig();
        clientConfig.name = this.config.application.name;
        clientConfig.description = this.config.application.description;
        clientConfig.externalOrigin = this.config.application.externalOrigin;
        clientConfig.loginPath = this.config.wellKnownPaths.loginPath;
        clientConfig.logoutPath = this.config.wellKnownPaths.logoutPath;
        clientConfig.logoUri = `${this.config.application.externalOrigin}${this.config.application.style.logoPath}`;
        clientConfig.facebookAppId = this.config.application.facebookAppId;
        clientConfig.twitterHandle = this.config.application.twitterHandle;
        const clientConfigRaw = AppController.clientConfigMarshaller.pack(clientConfig);
        return serializeJavascript(clientConfigRaw);
    }

    private prepareClientStateSer(user: User | null): string {
        const clientState = new ClientState();
        clientState.language = this.config.application.defaultLanguage;
        if (user === null) {
            clientState.user = null;
        } else {
            clientState.user = new ClientUser();
            clientState.user.agreedToPolicy = user.agreedToPolicy;
            clientState.user.displayName = user.displayName;
            clientState.user.pictureUri = user.pictureUri;
        }
        const clientStateRaw = AppController.clientStateMarshaller.pack(clientState);
        return serializeJavascript(clientStateRaw);
    }
}

export interface BasicViewResponse {
    applicationConfig: ApplicationConfig;
    clientConfigSer: string;
    clientStateSer: string;
}

@Module({
    controllers: [AppController],
})
export class AppModule { }
