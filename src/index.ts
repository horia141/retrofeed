import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as helmet from "helmet";

import { AppModule } from "./app-module";
import { Config, ConfigModule } from "./config";
import { DbConnModule } from "./db-conn";
import { StatusModule } from "./status-module";

@Module({
    imports: [
        AppModule,
        ConfigModule,
        DbConnModule,
        StatusModule,
    ],
})
class MainModule {}

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    app.use(helmet());
    app.use(compression());
    const config = app.get(Config);
    await app.listen(config.port);
}

bootstrap();
