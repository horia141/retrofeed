import { Controller, Get, Req, Render } from "@nestjs/common";
import * as express from "express";

import { AppService } from "./app-service";

@Controller()
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get()
    @Render("home")
    public async home(@Req() req: express.Request): Promise<HomeResponse> {
        return {
            title: "RetroFeed",
            content: `${this.appService.root()} - ${req.sessionID} - ${req.requestId}`,
        };
    }
}

interface HomeResponse {
    title: string;
    content: string;
}
