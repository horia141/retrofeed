exports.up = (knex, Promise) => knex.schema.raw(`
    CREATE TABLE auth.sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess JSON NOT NULL,
        expired TIMESTAMP WITH TIME ZONE NOT NULL
    );

    CREATE UNIQUE INDEX sessions_expired ON auth.sessions(expired);
`);

exports.down = (knex, Promise) => knex.schema.raw(`
    DROP INDEX IF EXISTS auth.sessions_expired;
    DROP TABLE IF EXISTS auth.sessions;
`);
