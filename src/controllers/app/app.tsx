import { Controller, Get, MiddlewareConsumer, Module, NestModule, Render, Req, UseGuards } from "@nestjs/common";
import { getNamespace } from "cls-hooked";
import * as express from "express";
import { MarshalFrom } from "raynor";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom";
import * as serializeJavascript from "serialize-javascript";

import { ViewAuthGuard } from "../../auth/auth";
import { AppFrame } from "../../client/app-frame";
import { ClientConfig, ClientState, User as ClientUser } from "../../client/shared";
import { ApplicationConfig, Config } from "../../infra/config";
import { NamespaceModule } from "../../infra/namespace";
import { NamespaceMiddleware } from "../../infra/namespace-middleware";
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
        return this.serverRender("/", req);
    }

    @Get("/not-found")
    @Render("app/app")
    public async notFound(@Req() req: express.Request): Promise<BasicViewResponse> {
        return this.serverRender("/not-found", req);
    }

    @Get("/admin")
    @Render("app/app")
    @UseGuards(ViewAuthGuard)
    public async admin(@Req() req: express.Request): Promise<BasicViewResponse> {
        return this.serverRender("/admin", req);
    }

    private serverRender(path: string, req: express.Request): BasicViewResponse {
        const clientConfig = this.prepareClientConfig();
        const clientState = this.prepareClientState(req.user ? (req.user as User) : null);

        const theNamespace = getNamespace("retrofeed");

        theNamespace.set("__RETROFEED_CLIENT_CONFIG", clientConfig);
        theNamespace.set("__RETROFEED_CLIENT_STATE", clientState);

        const staticContext: any = {};
        const appHtml = ReactDOMServer.renderToString(
            <StaticRouter location={path} context={staticContext} >
                <AppFrame />
            </StaticRouter>,
        );
        const helmetData = Helmet.renderStatic();

        return {
            applicationConfig: this.config.application,
            clientConfigSer: serializeJavascript(clientConfig),
            clientStateSer: serializeJavascript(clientState),
            ssr: {
                appHtml,
                title: helmetData.title.toString(),
                meta: helmetData.meta.toString(),
                link: helmetData.link.toString(),
                htmlAttributes: helmetData.htmlAttributes.toString(),
            },
        };
    }

    private prepareClientConfig(): object {
        const clientConfig = new ClientConfig();
        clientConfig.name = this.config.application.name;
        clientConfig.description = this.config.application.description;
        clientConfig.externalOrigin = this.config.application.externalOrigin;
        clientConfig.loginPath = this.config.wellKnownPaths.specialPages.loginPath;
        clientConfig.logoutPath = this.config.wellKnownPaths.specialPages.logoutPath;
        clientConfig.logoUri = `${this.config.application.externalOrigin}${this.config.application.style.logoPath}`;
        clientConfig.facebookAppId = this.config.application.facebookAppId;
        clientConfig.twitterHandle = this.config.application.twitterHandle;
        return AppController.clientConfigMarshaller.pack(clientConfig);
    }

    private prepareClientState(user: User | null): object {
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
        return AppController.clientStateMarshaller.pack(clientState);
    }
}

export interface BasicViewResponse {
    applicationConfig: ApplicationConfig;
    clientConfigSer: string;
    clientStateSer: string;
    ssr?: {
        appHtml: string;
        title: string;
        meta: string;
        link: string;
        htmlAttributes: string;
    };
}

@Module({
    controllers: [AppController],
    imports: [NamespaceModule],
})
export class AppModule implements NestModule {

    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(NamespaceMiddleware)
            .forRoutes(AppController);
    }
}
