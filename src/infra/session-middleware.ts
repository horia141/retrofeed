import { Inject, Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import * as session from "express-session";
import * as knex from "knex";
import * as moment from "moment";

import { Cookies, genUuid, isOnServer } from "./common";
import { Config } from "./config";

// tslint:disable:no-var-requires
const KnexSessionStore = require("connect-session-knex")(session);

@Injectable()
export class SessionMiddleware implements NestMiddleware {

    private readonly config: Config;
    private readonly conn: knex;

    constructor(config: Config, @Inject("DbConn") conn: knex) {
        this.config = config;
        this.conn = conn;
    }

    public resolve(): MiddlewareFunction {
        const store = new KnexSessionStore({
            knex: this.conn,
            tablename: "auth.sessions",
            sidfieldname: "sid",
            createtable: false,
        });

        return session({
            store,
            name: Cookies.Session,
            secret: this.config.sessionSecret,
            cookie: {
                domain: this.config.host,
                httpOnly: true,
                maxAge: moment.duration(42, "years").asMilliseconds(),
                path: "/",
                sameSite: "lax",
                secure: isOnServer(this.config.env),
            },
            // Our own UUID generator, cryptographically safe.
            genid: genUuid,
            // In production, behind GCPs loadbalancer communication will be HTTP based.
            // This option will set the cookie in this case, by looking for the X-Forwarded-Proto
            // header.
            proxy: true,
            // Sessions are immutable for our purposes. There'll be no need for automatic resaves.
            resave: false,
            // We don't update the session each time as our expiration is far into the future.
            rolling: false,
            // All sessions get stored, all requests have a session.
            saveUninitialized: true,
            // Sessions are never deleted, just marked as removed.
            unset: "keep",
        }) as MiddlewareFunction;
    }
}
