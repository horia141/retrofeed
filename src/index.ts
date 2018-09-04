import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as helmet from "helmet";
import * as passport from "passport";
import { join } from "path";
import * as serveStatic from "serve-static";
import * as webpack from "webpack";
import * as theWebpackDevMiddleware from "webpack-dev-middleware";

import { AuthController, AuthModule, ViewAuthFailedFilter } from "./auth/auth";
import { AppController, AppModule } from "./controllers/app/app";
import { IntegrationModule } from "./controllers/integration/integration";
import { StatusModule } from "./controllers/tech/status";
import { isLocal } from "./infra/common";
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
        IntegrationModule,
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
    app.setBaseViewsDir(join(__dirname, "controllers"));
    app.setViewEngine("hbs");
    app.use("/real/client/assets", serveStatic(join(__dirname, "assets"), { index: false }));
    if (isLocal(config.env)) {
        const webpackConfig = require("../webpack.config.js"); // TODO: get from config
        const webpackCompiler = webpack(webpackConfig);
        const webpackDevMiddleware = theWebpackDevMiddleware(webpackCompiler, {
            publicPath: "/",
            serverSideRender: false,
        });
        app.use("/real/client", webpackDevMiddleware);
    } else {
        app.use("/real/client", serveStatic(join(__dirname, "..", ".build", "client"), { index: false }));
    }

    app.use(helmet());
    app.use(compression());
    app.useGlobalFilters(new ViewAuthFailedFilter());
    await app.listen(config.port);
}

bootstrap();
