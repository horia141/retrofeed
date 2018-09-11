import { Inject, Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import { Namespace } from "cls-hooked";
import * as express from "express";

@Injectable()
export class NamespaceMiddleware implements NestMiddleware {

    private readonly theNamespace: Namespace;

    constructor(@Inject("Namespace") theNamespace: Namespace) {
        this.theNamespace = theNamespace;
    }

    public resolve(): MiddlewareFunction {
        return ((req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.theNamespace.bindEmitter(req);
            this.theNamespace.bindEmitter(res);

            return this.theNamespace.runAndReturn(() => {
                return next();
            });
        }) as MiddlewareFunction;
    }
}
