module.exports = app => {
  const bissues = require("../controllers/bissue.controller.js");

  var router = require("express").Router();

  

  // Create a new Book Issue
  router.post("/", bissues.create);

  // Retrieve all Book Issue
  router.get("/", bissues.findAll);

  // Retrieve all published students
  router.get("/active", bissues.findAllActive);

  // Retrieve a single student with id
  router.get("/:id", bissues.findOne);

  // Update a student with id
  router.put("/:id", bissues.update);

  // Delete a student with id
  router.delete("/:id", bissues.delete);

  // Create a new student
  router.delete("/", bissues.deleteAll);

  app.use("/api/bissues", router);
};
