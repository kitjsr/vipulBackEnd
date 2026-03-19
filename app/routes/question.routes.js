module.exports = app => {
  const questions = require("../controllers/question.controller.js");

  var router = require("express").Router();

  // Create a new question
  router.post("/", questions.create);

  // Retrieve all questions
  router.get("/", questions.findAll);

  // Retrieve all questions with all details
  router.get("/all", questions.allDetails);

  // Retrieve all published questions
  router.get("/active", questions.findAllActive);

  // Retrieve a single question with id
  router.get("/:id", questions.findOne);

  // Update a question with id
  router.put("/:id", questions.update);

  // Delete a question with id
  router.delete("/:id", questions.delete);

  // Create a new question
  router.delete("/", questions.deleteAll);

  app.use("/api/questions", router);
};
