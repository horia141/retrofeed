import { Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import * as express from "express";
import * as moment from "moment";
import { Moment } from "moment";

declare global {
    namespace Express {
        export interface Request {
            readonly requestTime: Moment;
        }
    }
}

@Injectable()
export class RequestTimeMiddleware implements NestMiddleware {

    public resolve(): MiddlewareFunction {
        return ((req: express.Request, _: express.Response, next: express.NextFunction) => {
            const requestTime = moment.utc();
            Object.defineProperty(req, "requestTime", { get: () => requestTime });
            next();
        }) as MiddlewareFunction;
    }
}
