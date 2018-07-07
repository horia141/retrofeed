import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app-module";
import { ConfigModule, ConfigService } from "./config";

@Module({
    imports: [
        AppModule,
        ConfigModule,
    ],
})
class MainModule {}

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    const config = app.get(ConfigService);
    await app.listen(config.port);
}

bootstrap();
