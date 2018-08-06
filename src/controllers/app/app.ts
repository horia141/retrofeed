import { Controller, Get, Module, Render, Req, UseGuards } from "@nestjs/common";
import * as express from "express";

import { ViewAuthGuard } from "../../auth/auth";
import { BasicViewResponse } from "../../infra/common";

@Controller("/")
export class AppController {

    @Get("/")
    @Render("app/home")
    public async home(@Req() req: express.Request): Promise<HomeResponse> {
        return {
            title: "RetroFeed",
            content: `Hello ${req.sessionID} - ${req.requestId}`,
            layout: "app/layout",
        };
    }

    @Get("/admin")
    @Render("app/admin")
    @UseGuards(ViewAuthGuard)
    public async admin(@Req() req: express.Request): Promise<AdminResponse> {
        return {
            title: "RetroFeed - Admin",
            userName: req.user.displayName,
            providerId: req.user.providerId,
            layout: "app/layout",
        };
    }
}

interface HomeResponse extends BasicViewResponse {
    content: string;
}

interface AdminResponse extends BasicViewResponse {
    userName: string;
    providerId: string;
}

@Module({
    controllers: [AppController],
})
export class AppModule {}
