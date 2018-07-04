import { NestFactory } from "@nestjs/core";

import { AppModule } from "./AppModule";
import { ConfigService } from "./config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    await app.listen(config.port);
}

bootstrap();
