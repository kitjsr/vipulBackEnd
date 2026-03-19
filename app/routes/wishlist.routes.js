module.exports = app => {
  const wishlist = require("../controllers/wishlist.controller.js");

  var router = require("express").Router();

  router.post("/", wishlist.create);
  router.get("/", wishlist.findAll);
  router.get("/user/:userId", wishlist.findByUser);
  router.get("/:id", wishlist.findOne);
  router.put("/:id", wishlist.update);
  router.delete("/:id", wishlist.delete);
  router.delete("/", wishlist.deleteAll);

  app.use("/api/wishlist", router);
};
