module.exports = app => {
  const branches = require("../controllers/branch.controller.js");

  var router = require("express").Router();

  // Create a new branch
  router.post("/", branches.create);

  // Retrieve all branches
  router.get("/", branches.findAll);

  // Retrieve all published branches
  router.get("/active", branches.findAllActive);

  // Retrieve a single branch with id
  router.get("/:id", branches.findOne);

  // Update a branch with id
  router.put("/:id", branches.update);

  // Delete a branch with id
  router.delete("/:id", branches.delete);

  // Create a new branch
  router.delete("/", branches.deleteAll);

  app.use("/api/branches", router);
};
