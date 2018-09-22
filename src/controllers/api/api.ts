import { Controller, Get, Module, Req } from "@nestjs/common";
import * as express from "express";

@Controller("/real/api")
export class ApiController {

    @Get("/")
    public async home(@Req() req: express.Request): Promise<{ id: string }> {
        return { id: req.requestId };
    }
}

@Module({
    controllers: [ApiController],
})
export class ApiModule {
}
