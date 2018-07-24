import { Controller, Get, Req, Render } from "@nestjs/common";
import * as express from "express";

import { AppService } from "./app-service";
import { BasicViewResponse } from "./common";

@Controller("/")
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get("/")
    @Render("home")
    public async home(@Req() req: express.Request): Promise<HomeResponse> {
        return {
            title: "RetroFeed",
            content: `${this.appService.root()} - ${req.sessionID} - ${req.requestId}`,
        };
    }

    @Get("/admin")
    @Render("admin")
    public async admin(): Promise<AdminResponse> {
        return {
            title: "RetroFeed - Admin",
            userName: "Horia",
        };
    }
}

interface HomeResponse extends BasicViewResponse {
    content: string;
}

interface AdminResponse extends BasicViewResponse {
    userName: string;
}
