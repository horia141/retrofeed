import { Injectable } from "@nestjs/common";

import { envToString } from "./common";
import { ConfigService } from "./config";

@Injectable()
export class AppService {
    constructor(private readonly config: ConfigService) {
    }

    public root(): string {
        return `Hello World - ${envToString(this.config.env)}`;
    }
}
