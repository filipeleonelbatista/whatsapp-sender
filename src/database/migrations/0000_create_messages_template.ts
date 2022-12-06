import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('messages-template', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('message').notNullable();
    table.string('filearray').notNullable();

    table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('messages-template');
}