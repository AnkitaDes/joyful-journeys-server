exports.up = function (knex) {
  return knex.schema.createTable("comments", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("comment", 1000).notNullable();
    table.integer("likes").notNullable().defaultTo(0);
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.integer("memoriesid").unsigned();
    table
      .foreign("memoriesid")
      .references("id")
      .inTable("memories")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
