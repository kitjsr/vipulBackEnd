const db = require("../models");
const Student = db.students;

const fs = require("fs");
  //C:\Users\Administrator\AngularNodeExpressMySQL\node-js-server\resources\static\assets
  //C:\Users\Administrator\AngularNodeExpressMySQL\node-js-server\app\resources\static\assets\uploads\
  global.__basedir = __dirname;
// Create and Save a new Student
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fullname) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  if (req.file === undefined) {
    return res.send(`You must select a file.`);
    console.log("You must select a file.");
  }
  // Create a Student
  const student = new Student({
    fullname: req.body.fullname,
    mobile: req.body.mobile,
    email: req.body.email,
    address: req.body.address,
    course: req.body.course,
    branch: req.body.branch,
    ssession: req.body.ssession,
    photo: req.file.filename,
    active: req.body.active ? req.body.active : false
  });

  // Save Student in the database
  student
    .save(student)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student."
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
  Student.aggregate([
    {
      $lookup: {
        from: 'courses', // Ensure this matches the actual collection name in MongoDB
        localField: 'course',
        foreignField: '_id',
        as: 'courseDetails'
      }
    },
    {
      $lookup: {
        from: 'branches', // Ensure this matches the actual collection name in MongoDB
        localField: 'branch',
        foreignField: '_id',
        as: 'branchDetails'
      }
    }
  ])
  .then(data => {
    if (data.length === 0) {
      console.log('No Student found or no matching branch/courses');
    } 
    else{
      res.send(data);

    }
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving students."
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
