const express = require("express");
const db = require("../database");
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("this is not auth redirect");
    return res.render("/gallery");
  }
}

router.get("/:user_id", (req, res) => {
  return req.db.Gallery.where({ user_id: req.params.user_id })
    .fetchAll()
    .then(gallery => {
      let results = gallery.toJSON();
      let recent = results[results.length - 1];
      console.log(results);
      if (results.length === 0) {
        throw new Error();
      } else {
        res.render("user/user", {
          results: results,
          recent: recent
        });
      }
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.put("/:gallery_id/edit", isAuthenticated, (req, res) => {
  let description = req.body.description.trim();
  console.log("put route works");
  let url = req.body.url.trim();
  if (req.body.description === "") {
    description = req.body.description;
  }
  if (req.body.url === "") {
    url = req.body.url;
  }
  return req.db.Gallery.where({ id: req.params.gallery_id })
    .save(
      {
        url: url,
        description: description
      },
      { patch: true, method: "update" }
    )
    .then(results => {
      console.log(results);
      res.redirect(`/gallery/${req.params.gallery_id}`);
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

module.exports = router;
