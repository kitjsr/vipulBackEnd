module.exports = app => {
  const customers = require("../controllers/customer.controller.js");

  var router = require("express").Router();

  // Create a new publisher
  router.post("/", customers.create);

  // Retrieve all publishers
  router.get("/", customers.findAll);

  // Retrieve all published publishers
  router.get("/active", customers.findAllActive);

  // Retrieve a single publisher with id
  router.get("/:id", customers.findOne);

  // Update a publisher with id
  router.put("/:id", customers.update);

  // Delete a publisher with id
  router.delete("/:id", customers.delete);

  // Create a new publisher
  router.delete("/", customers.deleteAll);

  app.use("/api/customers", router);
};
