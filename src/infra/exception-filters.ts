import { Catch, NotFoundException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import * as express from "express";
import * as HttpStatusCodes from "http-status-codes";

import { Config } from "./config";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {

    private readonly config: Config;

    public constructor(config: Config) {
        this.config = config;
    }

    catch(_exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest() as express.Request;
        const response = ctx.getResponse();

        if (request.path.startsWith(this.config.wellKnownPaths.sectionPrefixes.tech)) {
            response
                .status(HttpStatusCodes.NOT_FOUND)
                .send("Not Found");
        } else if (request.path.startsWith(this.config.wellKnownPaths.sectionPrefixes.clientResources)) {
            response
                .status(HttpStatusCodes.NOT_FOUND)
                .send("Not Found");
        } else if (request.path.startsWith(this.config.wellKnownPaths.sectionPrefixes.auth)) {
            response
                .status(HttpStatusCodes.NOT_FOUND)
                .send("Not Found");
        } else if (request.path.startsWith(this.config.wellKnownPaths.sectionPrefixes.api)) {
            response
                .status(HttpStatusCodes.NOT_FOUND)
                .json({
                    status: HttpStatusCodes.NOT_FOUND,
                    path: request.path,
                });
        } else {
            response.redirect(this.config.wellKnownPaths.specialPages.notFound);
        }
    }
}
