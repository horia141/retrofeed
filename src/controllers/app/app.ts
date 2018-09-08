import { Controller, Get, Module, Render, UseGuards } from "@nestjs/common";

import { ViewAuthGuard } from "../../auth/auth";
import { Config, ApplicationConfig } from "../../infra/config";

@Controller("/")
export class AppController {

    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    @Get("/|/foo")
    @Render("app/app")
    public async home(): Promise<BasicViewResponse> {
        return {
            applicationConfig: this.config.application,
            canonicalPath: "/",
            language: this.config.application.defaultLanguage
        };
    }

    @Get("/admin")
    @Render("app/app")
    @UseGuards(ViewAuthGuard)
    public async admin(): Promise<BasicViewResponse> {
        return {
            applicationConfig: this.config.application,
            canonicalPath: "/admin",
            language: this.config.application.defaultLanguage
        };
    }
}

export interface BasicViewResponse {
    applicationConfig: ApplicationConfig;
    canonicalPath: string;
    language: string;
}

@Module({
    controllers: [AppController],
})
export class AppModule { }
