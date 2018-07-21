import { Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import * as express from "express";
import * as uuid from "uuid";

import { Headers } from "../common";

declare global {
    namespace Express {
        class Request {
            public requestId: string;
        }
    }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {

    public resolve(): MiddlewareFunction {
        return ((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const requestId = uuid();
            req.requestId = requestId;
            res.setHeader(Headers.RequestId, requestId);
            next();
        }) as MiddlewareFunction;
    }
}
