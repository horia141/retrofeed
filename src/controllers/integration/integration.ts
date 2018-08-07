import { Controller, Get, Module, Render } from "@nestjs/common";

import { Config } from "../../infra/config";

@Controller("/")
export class IntegrationController {

    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    @Get("/robots.txt")
    @Render("integration/robots")
    public async robots(): Promise<RobotsViewResponse> {
        return {
            externalOrigin: this.config.externalOrigin
        };
    }

    @Get("/humans.txt")
    @Render("integration/humans")
    public async humans(): Promise<HumansViewResponse> {
        return {
            contactAuthors: this.config.contact.authors,
            contactEmail: this.config.contact.email
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

@Module({
    controllers: [IntegrationController],
})
export class IntegrationModule {}
