import { Controller, Get, Injectable, MiddlewareConsumer, Module, NestMiddleware, NestModule, Req, Res } from "@nestjs/common";
import { PassportSerializer, PassportStrategy } from "@nestjs/passport";
import * as express from "express";
import * as passport from "passport";
import { Config } from "./config";

const Strategy = require("passport-auth0");

@Controller("/real/auth")
export class AuthController {

    constructor() {
    }

    @Get("/login")
    public login() {
    }

    @Get("/callback")
    public callback() {
    }

    @Get("/logout")
    public logout(@Req() req: express.Request, @Res() res: express.Response){
        req.logout();
        res.redirect("/");
    }
}


@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {

    constructor(config: Config) {
        super({
            domain: config.auth0.domain,
            clientID: config.auth0.clientId,
            clientSecret: config.auth0.clientSecret,
            // TODO: better encoding for this.
            callbackURL: "/real/auth/callback",
        });
    }

    public async validate(_accessToken: any, _refreshToken: any, profile: any, done: Function) {
        // TODO: check that this is one of our users
        return done(null, profile);
    }
}

@Injectable()
export class Auth0Serializer extends PassportSerializer {
    public serializeUser(user: any, done: Function) {
        done(null, user.id);
    }

    public deserializeUser(id: string, done: Function) {
        done(null, { id });
    }
}

export function ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/real/auth/login')
}


@Injectable()
class AuthLoginMiddleware implements NestMiddleware {

    public resolve() {
        return passport.authenticate('auth0', {});
    }
}

@Injectable()
class AuthCallbackMiddleware implements NestMiddleware {

    public resolve() {
        return passport.authenticate('auth0', {
            successRedirect: '/admin',
            failureRedirect: '/'
        });
    }
}

@Module({
    controllers: [AuthController],
    providers: [Auth0Strategy, Auth0Serializer],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(AuthLoginMiddleware)
            .forRoutes("/real/auth/login");
        consumer
            .apply(AuthCallbackMiddleware)
            .forRoutes("/real/auth/callback");
    }
}
