module.exports = app => {
  const comments = require("../controllers/comment.controller.js");

  var router = require("express").Router();

  // Create a new question
  router.post("/", comments.create);

  // Retrieve all comments
  router.get("/", comments.findAll);


  // Retrieve all published comments
  router.get("/active", comments.findAllActive);

  // Retrieve a single question with id
  router.get("/:id", comments.findOne);

  // Update a question with id
  router.put("/:id", comments.update);

  // Delete a question with id
  router.delete("/:id", comments.delete);

  // Create a new question
  router.delete("/", comments.deleteAll);

  app.use("/api/comments", router);
};
