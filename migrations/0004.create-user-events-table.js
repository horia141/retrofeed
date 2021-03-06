exports.up = (knex, Promise) => knex.schema.raw(`
    CREATE TYPE auth.UserEventType AS ENUM ('Created', 'Recreated', 'Removed', 'AgreedToPolicy');
    CREATE TABLE auth.user_events (
        -- Primary key
        id Serial,
        PRIMARY KEY (id),
        -- Core properties
        type auth.UserEventType NOT NULL,
        timestamp Timestamp NOT NULL,
        data Jsonb NULL,
        -- Foreign key
        user_id Int NOT NULL REFERENCES auth.users(id)
    );

    CREATE INDEX user_events_user_id ON auth.user_events(user_id);
`);

exports.down = (knex, Promise) => knex.schema.raw(`
    DROP INDEX IF EXISTS auth.user_events_user_id;
    DROP TABLE IF EXISTS auth.user_events;
    DROP TYPE IF EXISTS auth.UserEventType;
`);
