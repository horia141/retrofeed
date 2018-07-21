import { Controller, Get, Req } from "@nestjs/common";
import * as express from "express";

import { AppService } from "./app-service";

@Controller()
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get()
    public async root(@Req() req: express.Request): Promise<string> {
        return `${this.appService.root()} - ${req.sessionID} - ${req.requestId}`;
    }
}
