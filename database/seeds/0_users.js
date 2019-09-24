const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "User 1", password: bcrypt.hashSync("asdf1", 12) },
        { username: "User 2", password: bcrypt.hashSync("asdf2", 12) },
        { username: "User 3", password: bcrypt.hashSync("asdf3", 12) }
      ]);
    });
};
