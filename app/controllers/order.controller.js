const db = require("../models");
const Order = db.orders;

// Create and Save a new Order
exports.create = (req, res) => {
  if (!req.body.userId || !req.body.items || req.body.items.length === 0) {
    return res.status(400).send({
      message: "Order must include userId and at least one item."
    });
  }

  const totalAmount = req.body.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const order = new Order({
    userId: req.body.userId,
    addressId: req.body.addressId,
    active: req.body.active || true,
    items: req.body.items,
    totalAmount: totalAmount,
    paymentStatus: req.body.paymentStatus || "pending",
    orderStatus: req.body.orderStatus || "processing"

    
  });

  order.save()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the order."
      });
    });
};

// Retrieve all Orders
exports.findAll = (req, res) => {
  Order.find()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders."
      });
    });
};

// Find a single Order by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Order.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Order with id " + id });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving Order with id=" + id });
    });
};

// Update an Order by ID
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  const id = req.params.id;

  Order.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Order with id=${id}. Maybe it was not found!`
        });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
};

// Delete an Order by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Order with id=${id}. Maybe it was not found!`
        });
      } else {
        res.send({ message: "Order was deleted successfully!" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id
      });
    });
};

// Delete all Orders
exports.deleteAll = (req, res) => {
  Order.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} Orders were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all orders."
      });
    });
};

// Find all active Orders
exports.findAllActive = (req, res) => {
  Order.find({ active: true })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving active orders."
      });
    });
};
