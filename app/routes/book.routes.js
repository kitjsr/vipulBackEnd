module.exports = app => {
  const books = require("../controllers/book.controller.js");

  var router = require("express").Router();

  // Create a new student
  router.post("/", books.create);

  // Retrieve all students
  router.get("/", books.findAll);

  // Retrieve all published students
  router.get("/active", books.findAllActive);

  // Retrieve a single student with id
  router.get("/:id", books.findOne);

  // Update a student with id
  router.put("/:id", books.update);

  // Delete a student with id
  router.delete("/:id", books.delete);

  // Create a new student
  router.delete("/", books.deleteAll);

  app.use("/api/books", router);
};
