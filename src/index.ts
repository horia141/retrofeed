import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as helmet from "helmet";
import * as passport from "passport";
import { join } from "path";

import { AuthController, AuthModule, ViewAuthFailedFilter } from "./auth/auth";
import { AppController, AppModule } from "./controllers/app/app";
import { StatusModule } from "./controllers/tech/status";
import { Config, ConfigModule } from "./infra/config";
import { DbConnModule } from "./infra/db-conn";
import { RequestIdMiddleware } from "./infra/request-id-middleware";
import { RequestTimeMiddleware } from "./infra/request-time-middleware";
import { RequestVersionMiddleware } from "./infra/request-version-middleware";
import { SessionMiddleware } from "./infra/session-middleware";
import { UserModule } from "./services/user/service";

@Module({
    imports: [
        AppModule,
        AuthModule,
        ConfigModule,
        DbConnModule,
        StatusModule,
        UserModule,
    ],
})
class MainModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(RequestIdMiddleware, RequestTimeMiddleware, RequestVersionMiddleware)
            .forRoutes("*");
        consumer
            .apply(
                SessionMiddleware,
                passport.initialize(),
                passport.session())
            .forRoutes(AppController, AuthController);
    }
}

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    const config = app.get(Config);
    app.setBaseViewsDir(join(__dirname, "controllers/app"));
    app.setViewEngine("hbs");
    app.use(helmet());
    app.use(compression());
    app.useGlobalFilters(new ViewAuthFailedFilter());
    await app.listen(config.port);
}

bootstrap();
