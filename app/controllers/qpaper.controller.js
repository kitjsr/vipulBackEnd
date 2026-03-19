const db = require("../models");
const Qpaper = db.qpapers;
const fs = require("fs");
  //C:\Users\Administrator\AngularNodeExpressMySQL\node-js-server\resources\static\assets
  //C:\Users\Administrator\AngularNodeExpressMySQL\node-js-server\app\resources\static\assets\uploads\
  global.__basedir = __dirname;

// Create and Save a new User
exports.create = (req, res) => {
  console.log("Hello")
    try {
      // console.log(req);
  
      if (req.file === undefined) {
        return res.send(`You must select a file.`);
        console.log("You must select a file.");
      }
  
      Qpaper.create({
        qname: req.body.qname,
        ename: req.body.ename,
        username: req.body.username,
        status: req.body.status ? req.body.status : false,
        photo: req.file.filename,
        
        
      }).then(data => {
            return res.send(data);
            console.log(data)
            return res.send(`File has been uploaded.`);
      });
    } catch (error) {
      console.log(error);
      return res.send(`Error when trying upload images: ${error}`);
    }
};

//Retrieve all Question Papers from the database.
exports.findAll = (req, res) => {
  const qname = req.query.qname;
  var condition = qname ? { qname: { $regex: new RegExp(qname), $options: "i" } } : {};

  Qpaper.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
};

// // Retrieve all Users from the database.
// exports.findLoginDetails = (req, res) => {
//   const email = req.body.email;

//   User.findAll({ where: {
//     email:email} })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users."
//       });
//     });
// };

// // Find a single Question with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Qpaper.findById(id)
  .then(data => {
    if (!data)
      res.status(404).send({ message: "Not found Question with id " + id });
    else res.send(data);
  })
  .catch(err => {
    res
      .status(500)
      .send({ message: "Error retrieving Question with id=" + id });
  });
};

// // Update a User by the id in the request
// exports.update = (req, res) => {
//   const id = req.params.id;

//   User.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "User was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating User with id=" + id
//       });
//     });
// };

// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   User.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "User was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete User with id=${id}. Maybe User was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete User with id=" + id
//       });
//     });
// };

// // Delete all Users from the database.
// exports.deleteAll = (req, res) => {
//   User.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Users were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all Users."
//       });
//     });
// };

// // find all published User
// exports.findAllPublished = (req, res) => {
//   User.findAll({ where: { status: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users."
//       });
//     });
// };

// Update a Qpaper by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Qpaper.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Qpaper with id=${id}. Maybe Qpaper was not found!`
        });
      } else res.send({ message: "Qpaper was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Qpaper with id=" + id
      });
    });
};

// Delete a Qpaper with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Qpaper.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Qpaper with id=${id}. Maybe Qpaper was not found!`
        });
      } else {
        res.send({
          message: "Qpaper was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Qpaper with id=" + id
      });
    });
};