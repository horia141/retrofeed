import { Controller, Get, Injectable, Module, Next, Req, Res, CanActivate, ExecutionContext, HttpStatus, HttpException, ExceptionFilter, ArgumentsHost, Catch } from "@nestjs/common";
import { PassportSerializer, PassportStrategy } from "@nestjs/passport";
import { NextFunction, Request, Response } from "express";
import * as passport from "passport";

import { Config } from "./config";

// tslint:disable:no-var-requires
const Strategy = require("passport-auth0");

@Controller("/real/auth")
export class AuthController {

    @Get("/login")
    public login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
        passport.authenticate("auth0", { connection: "github" } as any)(req, res, next);
    }

    @Get("/callback")
    public callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
        passport.authenticate("auth0", {
            successRedirect: "/admin",
            failureRedirect: "/",
        })(req, res, next);
    }

    @Get("/logout")
    public logout(@Req() req: Request, @Res() res: Response) {
        req.logout();
        res.redirect("/");
    }
}

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {

    constructor(config: Config) {
        super({
            domain: config.auth0.domain,
            clientID: config.auth0.clientId,
            clientSecret: config.auth0.clientSecret,
            // TODO: better encoding for this.
            callbackURL: "/real/auth/callback",
            audience: "https://" + config.auth0.domain + "/userinfo",
            responseType: "code",
            scope: "openid profile",
        });
    }

    public async validate(_: any, __: any, profile: any, done: Function) {
        // TODO: check that this is one of our users
        return done(null, profile);
    }
}

@Injectable()
export class AuthSerializer extends PassportSerializer {
    public serializeUser(user: any, done: Function) {
        done(null, { user_id: user.id, displayName: user.displayName });
    }

    public deserializeUser(profile: string, done: Function) {
        done(null, profile);
    }
}

class ViewAuthFailedException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}

@Catch(ViewAuthFailedException)
export class ViewAuthFailedFilter implements ExceptionFilter {
    public catch(_: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.redirect("/real/auth/login");
    }
}

@Injectable()
export class ViewAuthGuard implements CanActivate {

    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.isAuthenticated()) {
            return true;
        }
        throw new ViewAuthFailedException();
    }
}

@Module({
    controllers: [AuthController],
    providers: [AuthStrategy, AuthSerializer],
})
export class AuthModule {}
