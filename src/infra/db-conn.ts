import { Global, Module } from "@nestjs/common";
import * as knex from "knex";

import { Config } from "./config";

@Global()
@Module({
    providers: [{
        provide: "DbConn",
        useFactory: async (config: Config) => {
            const postgresConfig = config.postgres;
            const conn = knex({
                client: "pg",
                connection: {
                    host: postgresConfig.host,
                    port: postgresConfig.port,
                    database: postgresConfig.database,
                    user: postgresConfig.username,
                    password: postgresConfig.password,
                },
            });

            await conn.schema.raw("set session characteristics as transaction isolation level serializable;");

            return conn;
        },
        inject: [Config],
    }],
    exports: ["DbConn"],
})
export class DbConnModule { }
