import { Module } from "@nestjs/common";

import { AppController } from "./AppController";
import { AppService } from "./AppService";

@Module({
    imports: [],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
