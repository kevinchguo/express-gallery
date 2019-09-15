const knex = require("./knex");
const bookshelf = require("bookshelf")(knex); // so bookshelf knows to to use knex
module.exports = bookshelf;
