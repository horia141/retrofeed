import { Controller, Get, Header, Module, Render } from "@nestjs/common";

import { Config } from "../../infra/config";

@Controller("/")
export class IntegrationController {

    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    @Get("/robots.txt")
    @Header("Content-Type", "text/plain; charset=utf-8")
    @Render("integration/robots")
    public async robots(): Promise<RobotsViewResponse> {
        return {
            externalOrigin: this.config.application.externalOrigin,
        };
    }

    @Get("/humans.txt")
    @Header("Content-Type", "text/plain; charset=utf-8")
    @Render("integration/humans")
    public async humans(): Promise<HumansViewResponse> {
        return {
            contactAuthors: this.config.application.authors,
            contactEmail: this.config.application.contactEmail,
        };
    }

    @Get("/sitemap.xml")
    @Header("Content-Type", "application/xml; charset=utf-8")
    @Render("integration/sitemap")
    public async sitemap(): Promise<SitemapViewResponse> {
        return {
            externalOrigin: this.config.application.externalOrigin,
        };
    }

    @Get("/site.webmanifest")
    @Header("Content-Type", "application/manifest+json; charset=utf-8")
    @Render("integration/webmanifest")
    public async webmanifest(): Promise<WebmanifsetViewResponse> {
        return {
            title: this.config.application.name,
            primaryColor: this.config.application.style.primaryColor,
            backgroundColor: this.config.application.style.webmanifestBackgroundColor,
            externalOrigin: this.config.application.externalOrigin,
        };
    }

    @Get("/browserconfig.xml")
    @Header("Content-Type", "application/xml; charset=utf-8")
    @Render("integration/browserconfig")
    public async browserconfig(): Promise<BrowserconfigViewResponse> {
        return {
            tileColor: this.config.application.style.browserconfigTileColor,
        };
    }
}

interface RobotsViewResponse {
    externalOrigin: string;
}

interface HumansViewResponse {
    contactAuthors: string;
    contactEmail: string;
}

interface SitemapViewResponse {
    externalOrigin: string;
}

interface WebmanifsetViewResponse {
    title: string;
    primaryColor: string;
    backgroundColor: string;
    externalOrigin: string;
}

interface BrowserconfigViewResponse {
    tileColor: string;
}

@Module({
    controllers: [IntegrationController],
})
export class IntegrationModule {}
