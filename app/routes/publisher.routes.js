module.exports = app => {
  const publishers = require("../controllers/publisher.controller.js");

  var router = require("express").Router();

  // Create a new publisher
  router.post("/", publishers.create);

  // Retrieve all publishers
  router.get("/", publishers.findAll);

  // Retrieve all published publishers
  router.get("/active", publishers.findAllActive);

  // Retrieve a single publisher with id
  router.get("/:id", publishers.findOne);

  // Update a publisher with id
  router.put("/:id", publishers.update);

  // Delete a publisher with id
  router.delete("/:id", publishers.delete);

  // Create a new publisher
  router.delete("/", publishers.deleteAll);

  app.use("/api/publishers", router);
};
