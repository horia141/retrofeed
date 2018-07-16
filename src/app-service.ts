import { Injectable } from "@nestjs/common";

import { envToString } from "./common";
import { Config } from "./config";

@Injectable()
export class AppService {
    constructor(private readonly config: Config) {
    }

    public root(): string {
        return `Hello World - ${envToString(this.config.env)}`;
    }
}
