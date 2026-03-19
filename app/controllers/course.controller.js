const db = require("../models");
const Course = db.courses;

// Create and Save a new Course
exports.create = (req, res) => {
  // Validate request
  if (!req.body.cname) {
    res.status(400).send({ message: "Course Name can not be empty!" });
    return;
  }

  // Create a Course
  const course = new Course({
    cname: req.body.cname,
    active: req.body.active ? req.body.active : false
  });

  // Save Course in the database
  course
    .save(course)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Course."
      });
    });
};

// Retrieve all courses from the database.
exports.findAll = (req, res) => {
  const cname = req.query.cname;
  var condition = cname ? { cname: { $regex: new RegExp(cname), $options: "i" } } : {};

  Course.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Courses."
      });
    });
};

// Find a single Course with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Course.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Course with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Course with id=" + id });
    });
};

// Update a Course by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Course with id=${id}. Maybe Course was not found!`
        });
      } else res.send({ message: "Course was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Course with id=" + id
      });
    });
};

// Delete a Course with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Course.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Course with id=${id}. Maybe Course was not found!`
        });
      } else {
        res.send({
          message: "Course was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Course with id=" + id
      });
    });
};

// Delete all Course from the database.
exports.deleteAll = (req, res) => {
  Course.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Courses were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Courses."
      });
    });
};

// Find all published Courses
exports.findAllActive = (req, res) => {
  Course.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Courses."
      });
    });
};
