import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as helmet from "helmet";

import { AppController } from "./app-controller";
import { AppModule } from "./app-module";
import { Config, ConfigModule } from "./config";
import { DbConnModule } from "./db-conn";
import { RequestIdMiddleware } from "./middleware/request-id";
import { RequestTimeMiddleware } from "./middleware/request-time";
import { SessionMiddleware } from "./middleware/session";
import { StatusModule } from "./status-module";

@Module({
    imports: [
        AppModule,
        ConfigModule,
        DbConnModule,
        StatusModule,
    ],
})
class MainModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                helmet(),
                compression(),
                RequestIdMiddleware,
                RequestTimeMiddleware)
            .forRoutes("*");
        consumer
            .apply(SessionMiddleware)
            .forRoutes(AppController);
    }
}

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    const config = app.get(Config);
    await app.listen(config.port);
}

bootstrap();
