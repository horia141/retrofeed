import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as helmet from "helmet";
import * as passport from "passport";
import { join } from "path";

import { AppModule } from "./app-module";
import { AuthModule } from "./auth";
import { Config, ConfigModule } from "./config";
import { DbConnModule } from "./db-conn";
import { RequestIdMiddleware } from "./middleware/request-id";
import { RequestTimeMiddleware } from "./middleware/request-time";
import { SessionMiddleware } from "./middleware/session";
import { StatusModule } from "./status-module";

@Module({
    imports: [
        AppModule,
        AuthModule,
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
                RequestTimeMiddleware,
                SessionMiddleware,
                passport.initialize(),
                passport.session())
            .forRoutes("*");
        // consumer
        //     .apply(SessionMiddleware)
        //     .forRoutes(AppController, AuthController);
    }
}

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    const config = app.get(Config);
    app.setBaseViewsDir(join(__dirname, "views"));
    app.setViewEngine("hbs");
    await app.listen(config.port);
}

bootstrap();
