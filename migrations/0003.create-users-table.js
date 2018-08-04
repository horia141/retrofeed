exports.up = (knex, Promise) => knex.schema.raw(`
   CREATE TYPE auth.UserState AS ENUM ('Active', 'Removed');

   CREATE TABLE auth.users (
       -- Primary key,
       id Serial,
       PRIMARY KEY (id),
       -- Core properties
       state auth.UserState NOT NULL,
       agreed_to_policy Boolean NOT NULL,
       display_name Text NOT NULL,
       nickname Text NOT NULL,
       picture_uri Text NOT NULL,
       -- External foreign key
       provider_user_id Varchar(128) NOT NULL,
       -- Denormalized data
       time_created Timestamp NOT NULL,
       time_last_updated Timestamp NOT NULL,
       time_removed Timestamp NULL
   );

   CREATE UNIQUE INDEX users_provider_user_id ON auth.users(provider_user_id);
`);

exports.down = (knex, Promise) => knex.schema.raw(`
   DROP INDEX IF EXISTS auth.users_provider_user_id;
   DROP TABLE IF EXISTS auth.users;
   DROP TYPE IF EXISTS auth.UserState;
`);
