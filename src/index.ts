import { MiddlewareConsumer, Module, NestModule, NestMiddleware, Injectable } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as helmet from "helmet";
import * as passport from "passport";
import { join } from "path";

import { AppModule } from "./app-module";
import { AuthController } from "./auth-controller";
import { Auth0Module } from "./auth0-strategy";
import { Config, ConfigModule } from "./config";
import { DbConnModule } from "./db-conn";
import { RequestIdMiddleware } from "./middleware/request-id";
import { RequestTimeMiddleware } from "./middleware/request-time";
import { SessionMiddleware } from "./middleware/session";
import { StatusModule } from "./status-module";

import * as express from "express";

function ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(req.session);
    console.log(req.user);
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/real/auth/login')
}


@Injectable()
class Auth0LoginMiddleware implements NestMiddleware {

    public resolve() {
        return passport.authenticate('auth0', {});
    }
}

@Injectable()
class Auth0CallbackMiddleware implements NestMiddleware {

    public resolve() {
        return passport.authenticate('auth0', {
            successRedirect: '/admin',
            failureRedirect: '/'
        });
    }
}

@Module({
    // TODO: temp here!
    controllers: [AuthController],
    imports: [
        AppModule,
        Auth0Module,
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
        consumer
            .apply(Auth0LoginMiddleware)
            .forRoutes("/real/auth/login");
        consumer
            .apply(Auth0CallbackMiddleware)
            .forRoutes("/real/auth/callback");
        consumer.
            apply(ensureAuthenticated)
            .forRoutes("/admin");
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
