const db = require("../models");
const Address = db.addresses;

// Create and Save a new Branch
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.bname) {
  //   res.status(400).send({ message: "Branch Name can not be empty!" });
  //   return;
  // }

  // Create a Branch
  const address = new Address({
    userId: req.body.userId,
    name: req.body.name,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    district: req.body.district,
    state: req.body.state,
    pin: req.body.pin,
    mobile: req.body.mobile,
    email: req.body.email,
    addressType: req.body.addressType,
    active: req.body.active ? req.body.active : false
  });

  // Save Branch in the database
  address
    .save(address)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Address."
      });
    });
};

// Retrieve all barnchesthe database.
exports.findAll = (req, res) => {
  const bname = req.query.city;
  var condition = bname ? { cname: { $regex: new RegExp(bname), $options: "i" } } : {};

  Address.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Branchs."
      });
    });
};

exports.findByUser = (req, res) => {
  const userId = req.params.userId;

  Address.find({ userId })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving addresses for user " + userId
      });
    });
};
// Find a single Branch with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Address.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Branch with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Branch with id=" + id });
    });
};

// Update a Branch by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Address.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Branch with id=${id}. Maybe Branch was not found!`
        });
      } else res.send({ message: "Branch was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Branch with id=" + id
      });
    });
};

// Delete a Branch with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Address.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Branch with id=${id}. Maybe Branch was not found!`
        });
      } else {
        res.send({
          message: "Branch was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Branch with id=" + id
      });
    });
};

// Delete all Branch from the database.
exports.deleteAll = (req, res) => {
  Address.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Branchs were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Branchs."
      });
    });
};

// Find all published Branchs
exports.findAllActive = (req, res) => {
  Address.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Branchs."
      });
    });
};
