import { Global, Module } from "@nestjs/common";
import * as knex from "knex";

import { Config } from "./config";

@Global()
@Module({
    providers: [{
        provide: "DbConn",
        useFactory: (config: Config) => {
            const postgresConfig = config.postgres;
            return knex({
                client: "pg",
                connection: {
                    host: postgresConfig.host,
                    port: postgresConfig.port,
                    database: postgresConfig.database,
                    user: postgresConfig.username,
                    password: postgresConfig.password,
                },
            });
        },
        inject: [Config],
    }],
    exports: ["DbConn"],
})
export class DbConnModule { }
