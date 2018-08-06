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
}

interface RobotsViewResponse {
    externalOrigin: string;
}

@Module({
    controllers: [IntegrationController],
})
export class IntegrationModule {}
