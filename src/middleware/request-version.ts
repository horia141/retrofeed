import { Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import * as express from "express";

import { Headers } from "../common";
import { Config } from "../config";

declare global {
    namespace Express {
        export interface Request {
            readonly version: string;
        }
    }
}

@Injectable()
export class RequestVersionMiddleware implements NestMiddleware {

    constructor(private readonly config: Config) {
    }

    public resolve(): MiddlewareFunction {
        return ((_: express.Request, res: express.Response, next: express.NextFunction) => {
            res.setHeader(Headers.Version, this.config.version);
            next();
        }) as MiddlewareFunction;
    }
}
