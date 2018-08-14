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
            externalOrigin: this.config.externalOrigin,
        };
    }

    @Get("/humans.txt")
    @Header("Content-Type", "text/plain; charset=utf-8")
    @Render("integration/humans")
    public async humans(): Promise<HumansViewResponse> {
        return {
            contactAuthors: this.config.contact.authors,
            contactEmail: this.config.contact.email,
        };
    }

    @Get("/sitemap.xml")
    @Header("Content-Type", "application/xml; charset=utf-8")
    @Render("integration/sitemap")
    public async sitemap(): Promise<SitemapViewResponse> {
        return {
            externalOrigin: this.config.externalOrigin,
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

@Module({
    controllers: [IntegrationController],
})
export class IntegrationModule {}
