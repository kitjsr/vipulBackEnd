module.exports = app => {
  const cats = require("../controllers/cat.controller.js");

  var router = require("express").Router();

  // Create a new cat
  router.post("/", cats.create);

  // Retrieve all cats
  router.get("/", cats.findAll);

  // Retrieve all published cats
  router.get("/active", cats.findAllActive);

  router.get("/check", cats.checkDuplicateCategory);

  // Retrieve a single cat with id
  router.get("/:id", cats.findOne);

  // Update a cat with id
  router.put("/:id", cats.update);

  // Delete a cat with id
  router.delete("/:id", cats.delete);

  // Create a new student
  router.delete("/", cats.deleteAll);

  app.use("/api/cats", router);
};
