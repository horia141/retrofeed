import {
    ArgumentsHost,
    CanActivate,
    Catch,
    Controller,
    ExceptionFilter,
    ExecutionContext,
    Get,
    HttpException,
    HttpStatus,
    Injectable,
    Module,
    Next,
    Req,
    Res,
} from "@nestjs/common";
import { PassportSerializer, PassportStrategy } from "@nestjs/passport";
import { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import * as r from "raynor";
import { MarshalFrom, Marshaller, MarshalWith } from "raynor";

import { Config } from "../infra/config";
import { User } from "../services/user/entities";
import { UserModule, UserService } from "../services/user/service";

// tslint:disable:no-var-requires
const Strategy = require("passport-auth0");

export class AuthProviderProfile {

    @MarshalWith(r.StringMarshaller, "user_id")
    public providerId: string = "";

    @MarshalWith(r.StringMarshaller)
    public displayName: string = "";

    @MarshalWith(r.StringMarshaller)
    public nickname: string = "";

    @MarshalWith(r.SecureWebUriMarshaller, "picture")
    public pictureUri: string = "";
}

export class AuthSerializedProfile {

    public static fromUser(user: User): AuthSerializedProfile {
        const serializedProfile = new AuthSerializedProfile();
        serializedProfile.providerId = user.providerId;
        return serializedProfile;
    }

    @MarshalWith(r.StringMarshaller)
    public providerId: string = "";
}

@Controller("/real/auth")
export class AuthController {

    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    @Get("/login")
    public login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
        passport.authenticate("auth0", { connection: "github" } as any)(req, res, next);
    }

    @Get("/callback")
    public callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
        passport.authenticate("auth0", {
            successRedirect: this.config.wellKnownPaths.specialPages.adminPrefix,
            failureRedirect: this.config.wellKnownPaths.specialPages.home,
        })(req, res, next);
    }

    @Get("/logout")
    public logout(@Req() req: Request, @Res() res: Response) {
        req.logout();
        res.redirect(this.config.wellKnownPaths.specialPages.home);
    }
}

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {

    private readonly profileMarshaller: Marshaller<AuthProviderProfile> = new (MarshalFrom(AuthProviderProfile))();
    private readonly userService: UserService;

    constructor(config: Config, userService: UserService) {
        super({
            domain: config.auth0.domain,
            clientID: config.auth0.clientId,
            clientSecret: config.auth0.clientSecret,
            // TODO: better encoding for this.
            callbackURL: `${config.externalHost}/real/auth/callback`,
            audience: "https://" + config.auth0.domain + "/userinfo",
            responseType: "code",
            scope: "openid profile",
        });
        this.userService = userService;
    }

    public async validate(_: any, __: any, profileRaw: any, done: (error: Error | null, user: User) => void) {
        const profile = this.profileMarshaller.extract(profileRaw);
        const user = await this.userService.getOrCreateUser(
            false, profile.displayName, profile.nickname, profile.pictureUri, profile.providerId);
        done(null, user);
    }
}

@Injectable()
export class AuthSerializer extends PassportSerializer {

    private readonly serializedProfileMarshaller: Marshaller<AuthSerializedProfile>
        = new (MarshalFrom(AuthSerializedProfile))();
    private readonly userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    public serializeUser(user: User, done: (error: Error | null, data: AuthSerializedProfile) => void) {
        const serializedProfile = AuthSerializedProfile.fromUser(user);
        done(null, this.serializedProfileMarshaller.pack(serializedProfile));
    }

    public async deserializeUser(profile: string, done: (error: Error | null, user: User) => void) {
        const serializedProfile = this.serializedProfileMarshaller.extract(profile);
        const user = await this.userService.getUserByProviderId(serializedProfile.providerId);
        done(null, user);
    }
}

class ViewAuthFailedException extends HttpException {
    constructor() {
        super("Forbidden", HttpStatus.FORBIDDEN);
    }
}

@Catch(ViewAuthFailedException)
export class ViewAuthFailedFilter implements ExceptionFilter {

    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    public catch(_: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.redirect(this.config.wellKnownPaths.specialPages.loginPath);
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
    imports: [UserModule],
})
export class AuthModule { }
