const express = require("express");
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/gallery");
  }
}

router.get("/", (req, res) => {
  return req.db.Gallery.fetchAll({ withRelated: ["user"] })
    .then(results => {
      let loginStatus;
      let sessionUser;
      if (req.user) {
        loginStatus = true;
        sessionUser = req.user.username;
      } else {
        loginStatus = false;
      }
      const galleryList = results.toJSON().reverse();
      res.render("gallery/gallery", {
        results: galleryList,
        loginStatus: loginStatus,
        sessionUser: sessionUser
      });
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.get("/new", isAuthenticated, (req, res) => {
  res.render("gallery/new");
});

router.post("/new", (req, res) => {
  let description = req.body.description.trim();
  let url = req.body.url.trim();
  if (req.body.description === "") {
    description = req.body.description;
  }
  if (req.body.url === "") {
    url = req.body.url;
  }
  return req.db.Gallery.forge({
    user_id: req.user.id,
    url: url,
    description: description
  })
    .save()
    .then(results => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.get("/:gallery_id", (req, res) => {
  return req.db.Gallery.where({ id: req.params.gallery_id })
    .fetchAll({ withRelated: ["user"] })
    .then(results => {
      const gallery = results.toJSON();
      console.log(gallery[0]);
      let loginStatus = false;
      if (!gallery[0]) {
        throw new Error();
      }
      if (req.user) {
        if (req.user.id === gallery[0].user.id) {
          loginStatus = true;
        }
      }
      res.render("gallery/galleryId", {
        results: gallery[0],
        loginStatus: loginStatus
      });
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.get("/:gallery_id/edit", (req, res) => {
  return req.db.Gallery.where({ id: req.params.gallery_id })
    .fetchAll({ withRelated: ["user"] })
    .then(results => {
      const gallery = results.toJSON();
      if (req.user) {
        if (req.user.id === gallery[0].user_id) {
          //if sessionUser is the currentUser
          res.render("user/edit", { results: gallery[0] });
        } else {
          // if sessionUser != currentUser
          res.redirect("/gallery");
        }
      } else {
        //if there is no sessionUser
        res.redirect("/gallery");
      }
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.put("/:gallery_id", isAuthenticated, (req, res) => {
  let description = req.body.description.trim();
  let url = req.body.url.trim();
  let sessionUser = req.user.id;
  let currentUser;
  if (req.body.description === "") {
    description = req.body.description;
  }
  if (req.body.url === "") {
    url = req.body.url;
  }
  new req.db.Gallery({ id: req.params.gallery_id })
    .fetch()
    .then(results => {
      currentUser = results.toJSON().user_id;
      if (sessionUser === currentUser) {
        return new req.db.Gallery({ id: req.params.gallery_id })
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
          });
      } else {
        res.redirect("/gallery");
      }
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.get("/:gallery_id/delete", (req, res) => {
  return req.db.Gallery.where({ id: req.params.gallery_id })
    .fetchAll({ withRelated: ["user"] })
    .then(results => {
      const gallery = results.toJSON();
      if (req.user) {
        if (req.user.id === gallery[0].user_id) {
          //if sessionUser is the currentUser
          res.render("user/delete", { results: gallery[0] });
        } else {
          //if sessionUser != currentUser
          res.redirect("/gallery");
        }
      } else {
        //if there is no sessionUser
        res.redirect("/gallery");
      }
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

router.delete("/:gallery_id", isAuthenticated, (req, res) => {
  let sessionUser = req.user.id;
  let currentUser;
  new req.db.Gallery({ id: req.params.gallery_id })
    .fetch()
    .then(results => {
      currentUser = results.toJSON().user_id;
      if (sessionUser === currentUser) {
        return new req.db.Gallery({ id: req.params.gallery_id })
          .destroy()
          .then(results => res.redirect("/gallery"));
      } else {
        res.redirect("/gallery");
      }
    })
    .catch(err => {
      res.render("error", { error: err });
      return;
    });
});

module.exports = router;
