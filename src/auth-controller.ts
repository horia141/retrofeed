import { Controller, Get, Req, Res } from "@nestjs/common";
import * as express from "express";

@Controller("/real/auth")
export class AuthController {

    constructor() {
    }

    @Get("/login")
    public login() {
    }

    @Get("/callback")
    public callback() {
    }

    @Get("/logout")
    public logout(@Req() req: express.Request, @Res() res: express.Response){
        req.logout();
        res.redirect("/");
    }
}
