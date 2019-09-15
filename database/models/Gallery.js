const bookshelf = require("../bookshelf");

class Gallery extends bookshelf.Model {
  get tableName() {
    return "gallery";
  }

  get hasTimeStamps() {
    return true;
  }
}

module.exports = bookshelf.model("Gallery", Gallery);
