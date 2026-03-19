module.exports = app => {
  const addresses = require("../controllers/address.controller.js");

  var router = require("express").Router();

  // Create a new student
  router.post("/", addresses.create);

  // Retrieve all students
  router.get("/", addresses.findAll);

  router.get("/user/:userId", addresses.findByUser);

  // Retrieve all published students
  router.get("/active", addresses.findAllActive);

  // Retrieve a single student with id
  router.get("/:id", addresses.findOne);

  // Update a student with id
  router.put("/:id", addresses.update);

  // Delete a student with id
  router.delete("/:id", addresses.delete);

  // Create a new student
  router.delete("/", addresses.deleteAll);

  app.use("/api/addresses", router);
};
