import { Controller, Get } from "@nestjs/common";

import { AppService } from "./AppService";

@Controller()
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get()
    public async root(): Promise<string> {
        return this.appService.root();
    }
}
