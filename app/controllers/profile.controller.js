const db = require("../models");
const Profile = db.profiles;

// Create and Save a new Profile
exports.create = (req, res) => {
  // Validate request
  if (!req.body.profileName) {
    res.status(400).send({ message: "Profile Name can not be empty!" });
    return;
  }

  // Create a Profile
  const profile = new Profile({
    profileName: req.body.profileName,
    subProfileName: req.body.subProfileName,
    followers: req.body.followers,
    role: req.body.role,
    workingAt: req.body.workingAt,
    livesIn: req.body.livesIn,
    motherTongue: req.body.motherTongue,
    active: req.body.active ? req.body.active : false
  });

  // Save Profile in the database
  profile
    .save(profile)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile."
      });
    });
};

// Retrieve all Profiles from the database.
exports.findAll = (req, res) => {
  const name = req.query.profileName;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Profile.find(condition)
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

// Find a single Profile with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Profile.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Profile with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Profile with id=" + id });
    });
};

// Update a Profile by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Profile.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Profile with id=${id}. Maybe Profile was not found!`
        });
      } else res.send({ message: "Profile was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Profile with id=" + id
      });
    });
};

// Delete a Profile with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Profile.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`
        });
      } else {
        res.send({
          message: "Profile was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Profile with id=" + id
      });
    });
};

// Delete all Profile from the database.
exports.deleteAll = (req, res) => {
  Profile.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Profiles were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Profiles."
      });
    });
};

// Find all published Profiles
exports.findAllActive = (req, res) => {
  Profile.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Profiles."
      });
    });
};
