const db = require("../models");
const Bissue = db.bissues;

// Create and Save a new Branch
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.bname) {
  //   res.status(400).send({ message: "Branch Name can not be empty!" });
  //   return;
  // }

  // Create a Branch
  const bissue = new Bissue({
    book: req.body.book,
    student: req.body.student,
    active: req.body.active ? req.body.active : false
  });

  // Save Branch in the database
  bissue
    .save(bissue)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while storing book issue details."
      });
    });
};

// Retrieve all Students from the database.
exports.findAll = (req, res) => {
  // const fullname = req.query.fullname;
  // var condition = fullname ? { fullname: { $regex: new RegExp(title), $options: "i" } } : {};

  // Student.find(condition)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving Students."
  //     });
  //   });
  Bissue.aggregate([
    {
      $lookup: {
        from: 'books', // Ensure this matches the actual collection name in MongoDB
        localField: 'book',
        foreignField: '_id',
        as: 'bookDetails'
      }
    },
    {
      $lookup: {
        from: 'students', // Ensure this matches the actual collection name in MongoDB
        localField: 'student',
        foreignField: '_id',
        as: 'studentDetails'
      }
    }
  ])
  .then(data => {
    if (data.length === 0) {
      console.log('No Data found or other issues');
    } 
    else{
      res.send(data);

    }
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving."
    });
  });
};

// Find a single Student with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Student with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Student with id=" + id });
    });
};

// Update a Student by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Student with id=${id}. Maybe Student was not found!`
        });
      } else res.send({ message: "Student was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Student with id=" + id
      });
    });
};

// Delete a Student with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Student.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
        });
      } else {
        res.send({
          message: "Student was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Student with id=" + id
      });
    });
};

// Delete all Student from the database.
exports.deleteAll = (req, res) => {
  Student.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Students were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all students."
      });
    });
};

// Find all published Students
exports.findAllActive = (req, res) => {
  Student.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Students."
      });
    });
};
