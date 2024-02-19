exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username").notNullable();
      table.string("email").notNullable().unique();
      table.string("password_hash").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("memories", (table) => {
      table.increments("id").unsigned().notNullable().primary();
      table.string("description", 1000).notNullable();
      table.string("image").notNullable();
      table.integer("likes").notNullable().defaultTo(0);
      table.integer("users_id").unsigned();
      table
        .foreign("users_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("memories").dropTable("users");
};
