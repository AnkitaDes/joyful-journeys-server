exports.up = function (knex) {
  return knex.schema.createTable("memories", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description", 1000).notNullable();
    table.string("image").notNullable();
    table.integer("likes").notNullable().defaultTo(0);
    table
      .integer("users_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("memories");
};
