import { Controller, Get, Render, Req, UseGuards } from "@nestjs/common";
import * as express from "express";

import { AppService } from "./app-service";
import { BasicViewResponse } from "./common";
import { ViewAuthGuard } from "./auth";

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
    @UseGuards(ViewAuthGuard)
    public async admin(@Req() req: express.Request): Promise<AdminResponse> {
        return {
            title: "RetroFeed - Admin",
            userName: req.user.displayName,
            userId: req.user.user_id,
        };
    }
}

interface HomeResponse extends BasicViewResponse {
    content: string;
}

interface AdminResponse extends BasicViewResponse {
    userName: string;
    userId: string;
}
