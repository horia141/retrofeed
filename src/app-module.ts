import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppController } from "./app-controller";
import { AppService } from "./app-service";
import { ensureAuthenticated } from "./auth";

@Module({
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(ensureAuthenticated)
            .forRoutes("/admin");
    }
}
