module.exports = app => {
  const answers = require("../controllers/answer.controller.js");

  var router = require("express").Router();

  // Create a new question
  router.post("/", answers.create);

  // Retrieve all answers
  router.get("/", answers.findAll);

  // Retrieve all published answers
  router.get("/active", answers.findAllActive);

  // Retrieve a single question with id
  router.get("/:id", answers.findOne);

  // Update a question with id
  router.put("/:id", answers.update);

  // Delete a question with id
  router.delete("/:id", answers.delete);

  // Create a new question
  router.delete("/", answers.deleteAll);

  app.use("/api/answers", router);
};
