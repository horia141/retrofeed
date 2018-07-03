exports.up = (knex, Promise) => knex.schema.raw(
    'CREATE SCHEMA auth'
);

exports.down = (knex, Promise) => knex.schema.raw(
    'DROP SCHEMA IF EXISTS auth'
);
