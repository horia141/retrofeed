import { Module } from "@nestjs/common";

import { AppController } from "./AppController";
import { AppService } from "./AppService";
import { ConfigModule } from "./config";

@Module({
    imports: [ConfigModule],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
