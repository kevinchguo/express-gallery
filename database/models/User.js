const bookshelf = require("../bookshelf");

class User extends bookshelf.Model {
  get tableName() {
    return "users";
  }

  get hasTimeStamps() {
    return true;
  }
}

module.exports = bookshelf.model("User", User);
