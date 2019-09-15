const express = require("express");
const db = require("../database");
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.render("user/user");
  }
}

router.get("/", isAuthenticated, (req, res) => {
  res.render("user/user");
});

module.exports = router;
