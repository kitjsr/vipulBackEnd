const db = require("../models");
const Publisher = db.publishers;

// Create and Save a new Publisher
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }

  // Create a Publisher
  const publisher = new Publisher({
    name: req.body.name,
    mobile: req.body.mobile,
    email:req.body.email,
    address: req.body.address,
    
    active: req.body.active ? req.body.active : false
  });

  // Save Publisher in the database
  publisher
    .save(publisher)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Publisher."
      });
    });
};

// Retrieve all Publishers from the database.
exports.findAll = (req, res) => {
  const fullname = req.query.fullname;
  var condition = fullname ? { fullname: { $regex: new RegExp(title), $options: "i" } } : {};

  Publisher.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Publishers."
      });
    });
};

// Find a single Publisher with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Publisher.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Publisher with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Publisher with id=" + id });
    });
};

// Update a Publisher by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Publisher.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Publisher with id=${id}. Maybe Publisher was not found!`
        });
      } else res.send({ message: "Publisher was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Publisher with id=" + id
      });
    });
};

// Delete a Publisher with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Publisher.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Publisher with id=${id}. Maybe Publisher was not found!`
        });
      } else {
        res.send({
          message: "Publisher was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Publisher with id=" + id
      });
    });
};

// Delete all Publisher from the database.
exports.deleteAll = (req, res) => {
  Publisher.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Publishers were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Publishers."
      });
    });
};

// Find all published Publishers
exports.findAllActive = (req, res) => {
  Publisher.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Publishers."
      });
    });
};
