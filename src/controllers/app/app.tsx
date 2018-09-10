import { Controller, Get, Module, Render, Req, UseGuards, NestModule, MiddlewareConsumer } from "@nestjs/common";
import * as express from "express";
import * as serializeJavascript from "serialize-javascript";
import * as React from "react";
import { StaticRouter } from "react-router-dom";
import * as ReactDOMServer from "react-dom/server";
import { Helmet } from "react-helmet";
import { getNamespace } from "cls-hooked";

import { MarshalFrom } from "../../../node_modules/raynor";
import { ViewAuthGuard } from "../../auth/auth";
import { ClientConfig, ClientState, User as ClientUser } from "../../client/shared";
import { AppFrame } from "../../client/app-frame";
import { ApplicationConfig, Config } from "../../infra/config";
import { User } from "../../services/user/entities";
import { NamespaceModule } from "../../infra/namespace";
import { NamespaceMiddleware } from "../../infra/namespace-middleware";

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

        const clientConfig = this.prepareClientConfig();
        const clientState = this.prepareClientState(req.user ? (req.user as User) : null);

        const theNamespace = getNamespace("retrofeed");

        theNamespace.set("__RETROFEED_CLIENT_CONFIG", clientConfig);
        theNamespace.set("__RETROFEED_CLIENT_STATE", clientState);

        const staticContext: any = {};
        const appHtml = ReactDOMServer.renderToString(
            <StaticRouter location="/" context={staticContext} >
                <AppFrame />
            </StaticRouter>
        );
        const helmetData = Helmet.renderStatic();

        return {
            applicationConfig: this.config.application,
            clientConfigSer: serializeJavascript(clientConfig),
            clientStateSer: serializeJavascript(clientState),
            ssr: {
                appHtml: appHtml,
                title: helmetData.title.toString(),
                meta: helmetData.meta.toString(),
                link: helmetData.link.toString(),
                htmlAttributes: helmetData.htmlAttributes.toString()
            }
        };
    }

    @Get("/admin")
    @Render("app/app")
    @UseGuards(ViewAuthGuard)
    public async admin(@Req() req: express.Request): Promise<BasicViewResponse> {

        const clientConfig = this.prepareClientConfig();
        const clientState = this.prepareClientState(req.user as User);

        const theNamespace = getNamespace("retrofeed");

        theNamespace.set("__RETROFEED_CLIENT_CONFIG", clientConfig);
        theNamespace.set("__RETROFEED_CLIENT_STATE", clientState);

        const staticContext: any = {};
        const appHtml = ReactDOMServer.renderToString(
            <StaticRouter location="/" context={staticContext} >
                <AppFrame />
            </StaticRouter>
        );
        const helmetData = Helmet.renderStatic();

        return {
            applicationConfig: this.config.application,
            clientConfigSer: serializeJavascript(clientConfig),
            clientStateSer: serializeJavascript(clientState),
            ssr: {
                appHtml: appHtml,
                title: helmetData.title.toString(),
                meta: helmetData.meta.toString(),
                link: helmetData.link.toString(),
                htmlAttributes: helmetData.htmlAttributes.toString()
            }
        };
    }

    private prepareClientConfig(): object {
        const clientConfig = new ClientConfig();
        clientConfig.name = this.config.application.name;
        clientConfig.description = this.config.application.description;
        clientConfig.externalOrigin = this.config.application.externalOrigin;
        clientConfig.loginPath = this.config.wellKnownPaths.loginPath;
        clientConfig.logoutPath = this.config.wellKnownPaths.logoutPath;
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
    }
}

@Module({
    controllers: [AppController],
    imports: [NamespaceModule]
})
export class AppModule implements NestModule {

    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(NamespaceMiddleware)
            .forRoutes(AppController);
    }
}
