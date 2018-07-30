import { Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import * as express from "express";

import { genUuid, Headers } from "./common";

declare global {
    namespace Express {
        export interface Request {
            readonly requestId: string;
        }
    }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {

    public resolve(): MiddlewareFunction {
        return ((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const requestId = genUuid();
            Object.defineProperty(req, "requestId", { get: () => requestId });
            res.setHeader(Headers.RequestId, requestId);
            next();
        }) as MiddlewareFunction;
    }
}
