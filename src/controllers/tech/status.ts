import { Controller, Get, Module } from "@nestjs/common";

@Controller("/real/tech/status")
export class StatusController {

    @Get("/")
    public async status(): Promise<string> {
        return "OK";
    }
}

@Module({
    controllers: [StatusController],
})
export class StatusModule { }
