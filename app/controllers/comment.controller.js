const db = require("../models");
const Comment = db.comments
const Publisher = db.publishers;

const mongoose = require("mongoose");
// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
 
  if (!req.body.comment) {
    res.status(400).send({ message: "Comment can not be empty!" });
    return;
  }
   
  // Create a Book
  const comment = new Comment({
    answer: req.body.answer,
    user: req.body.user,
    comment: req.body.comment,
    active: req.body.active ? req.body.active : false
  });

  // Save Book in the database
  comment
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Comment.",
      });
    });
};

// Retrieve all Books from the database.
// exports.findAll = (req, res) => {
//   const name = req.query.name;
//   var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

//   Book.find(condition)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Books."
//       });
//     });
// };

exports.findAll = (req, res) => {
  
  Comment.aggregate([
    {
      $lookup: {
        from: "answers", // Ensure this matches the actual collection name in MongoDB
        localField: "answer",
        foreignField: "_id",
        as: "answerDetails",
      },
    },
    {
      $lookup: {
        from: "users", // Ensure this matches the actual collection name in MongoDB
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
  ])
    .then((data) => {
      if (data.length === 0) {
        console.log("No books found or no matching Answer/User");
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Answer/User.",
      });
    });
};
// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  // Ensure the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid book ID format" });
  }
  Comment.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Book with id " + id });
      else {
        Comment.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(id) } },
          {
            $lookup: {
              from: "publishers", // Ensure this matches the actual collection name in MongoDB
              localField: "publisher",
              foreignField: "_id",
              as: "publisherDetails",
            },
          },
          {
            $lookup: {
              from: "cats", // Ensure this matches the actual collection name in MongoDB
              localField: "category",
              foreignField: "_id",
              as: "categoryDetails",
            },
          },
        ])
          .then((data) => {
            if (data.length === 0) {
              console.log(
                "No books found or no matching publishers/categories"
              );
            } else {
              res.send(data);
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving books and publishers.",
            });
          });
        // res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Book with id=" + id });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Comment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found!`,
        });
      } else res.send({ message: "Book was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Book with id=" + id,
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Comment.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Book with id=${id}. Maybe Book was not found!`,
        });
      } else {
        res.send({
          message: "Book was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Book with id=" + id,
      });
    });
};

// Delete all Book from the database.
exports.deleteAll = (req, res) => {
  Comment.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Books were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Books.",
      });
    });
};

// Find all published Books
exports.findAllActive = (req, res) => {
  Comment.find({ active: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Books.",
      });
    });
};
