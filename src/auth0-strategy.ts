import { Injectable, Module } from "@nestjs/common";
import { PassportStrategy, PassportSerializer } from "@nestjs/passport";
import { Config } from "./config";

const Strategy = require("passport-auth0");

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
        console.log("HERE HERE");
        done(null, user.id);
    }

    public deserializeUser(id: string, done: Function) {
        done(null, { id });
    }
}

@Module({
    providers: [Auth0Strategy, Auth0Serializer],
})
export class Auth0Module { }
