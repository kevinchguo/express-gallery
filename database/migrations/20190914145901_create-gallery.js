exports.up = function(knex) {
  return knex.schema.createTable("gallery", table => {
    table.increments();
    table.text("author").notNullable();
    table.text("url").notNullable();
    table.text("description").notNullable();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("gallery");
};
