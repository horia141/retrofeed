import { Injectable } from "@nestjs/common";
import { ConfigService } from "./config";
import { envToString } from "./common";

@Injectable()
export class AppService {
    constructor(private readonly config: ConfigService) {
    }

    public root(): string {
        return `Hello World - ${envToString(this.config.env)}`;
    }
}
