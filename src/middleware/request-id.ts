import * as express from "express";
import * as uuid from "uuid";

import { Headers } from "../common";

export function newRequestId(): express.RequestHandler {
    return (_: express.Request, res: express.Response, next: express.NextFunction) => {
        res.setHeader(Headers.RequestId, uuid());
        next();
    };
}
