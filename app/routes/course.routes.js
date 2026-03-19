module.exports = app => {
  const courses = require("../controllers/course.controller.js");

  var router = require("express").Router();

  // Create a new course
  router.post("/", courses.create);

  // Retrieve all courses
  router.get("/", courses.findAll);

  // Retrieve all published courses
  router.get("/active", courses.findAllActive);

  // Retrieve a single course with id
  router.get("/:id", courses.findOne);

  // Update a course with id
  router.put("/:id", courses.update);

  // Delete a course with id
  router.delete("/:id", courses.delete);

  // Create a new course
  router.delete("/", courses.deleteAll);

  app.use("/api/courses", router);
};
