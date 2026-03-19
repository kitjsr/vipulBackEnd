const db = require("../models");
const Answer = db.answers;

// Create and Save a new Answer
exports.create = (req, res) => {
  // Validate request
  if (!req.body.answer) {
    res.status(400).send({ message: "Answer can not be empty!" });
    return;
  }

  // Create a Question
  const answer = new Answer({
    answer: req.body.answer,
    question: req.body.question,
    user: req.body.user,
    status: req.body.status ? req.body.status : false
  });

  // Save Question in the database
  answer
    .save(answer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Answer."
      });
    });
};

// Retrieve all Questions from the database.
exports.findAll = (req, res) => {
 Answer.aggregate([
    {
      $lookup: {
        from: "profiles", // Ensure this matches the actual collection name in MongoDB
        localField: "user",
        foreignField: "_id",
        as: "profileDetails",
      },
    },
    {
      $lookup: {
        from: "questions", // Ensure this matches the actual collection name in MongoDB
        localField: "question",
        foreignField: "_id",
        as: "questionDetails",
      },
    },
    
  ])
    .then((data) => {
      if (data.length === 0) {
        console.log("No Question found or no matching profiles");
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving profiles.",
      });
    });
};

// Find a single Answer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Answer.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Answer with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Cat with id=" + id });
    });
};

// Update a Cat by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Answer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Answer with id=${id}. Maybe Answer was not found!`
        });
      } else res.send({ message: "Answer was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Answer with id=" + id
      });
    });
};

// Delete a Answer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Answer.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Answer with id=${id}. Maybe Answer was not found!`
        });
      } else {
        res.send({
          message: "Answer was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Answer with id=" + id
      });
    });
};

// Delete all Answer from the database.
exports.deleteAll = (req, res) => {
  Answer.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Questions were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Questions."
      });
    });
};

// Find all published Questions
exports.findAllActive = (req, res) => {
  Answer.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Questions."
      });
    });
};
