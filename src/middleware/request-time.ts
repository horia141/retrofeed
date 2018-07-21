import * as express from "express";
import * as moment from "moment";
import { Moment } from "moment";
import { Injectable, MiddlewareFunction, NestMiddleware } from "../../node_modules/@nestjs/common";

declare global {
    namespace Express {
        interface Request {
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
