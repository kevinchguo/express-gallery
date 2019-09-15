const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
  return req.db.Gallery.fetchAll().then(results => {
    const galleryList = results.models.map(gallery => gallery.attributes);
    res.render("gallery/gallery", { results: galleryList });
  });
});

router.get("/:gallery_id", (req, res) => {
  return req.db.Gallery.fetchAll().then(results => {
    const galleryList = results.models.map(gallery => gallery.attributes);
    res.render("gallery/gallery", { results: galleryList });
  });
});

module.exports = router;
