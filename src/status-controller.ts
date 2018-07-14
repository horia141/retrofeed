import { Controller, Get } from "@nestjs/common";

@Controller("status")
export class StatusController {

    @Get()
    public async status(): Promise<string> {
        return "OK";
    }
}
