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
exports.findAll = async (req, res) => {
  try {
    const data = await Order.find({})
      .populate("userId") // populate user details
      // .populate("addressId") // populate address details
      .populate("items.productId"); // populate product details

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Orders."
    });
  }
};

exports.findByUser = async (req, res) => {
  try {
    const data = await Order.find({ userId: req.params.userId })
      .populate("userId")
      // .populate("addressId")
      .populate("items.productId");

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Orders."
    });
  }
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


exports.dailyReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    });

    res.send({
      date: start.toDateString(),
      totalOrders: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).send({ message: "Error generating daily report", error });
  }
};

// 2. Monthly Report
exports.monthlyReport = async (req, res) => {
  try {
    const { year, month } = req.params;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    });

    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.send({
      month,
      year,
      totalOrders: orders.length,
      totalAmount,
      orders
    });

  } catch (error) {
    res.status(500).send({ message: "Error generating monthly report", error });
  }
};

// 3. Orders by Status
exports.ordersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const orders = await Order.find({ status });

    res.send({
      status,
      totalOrders: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).send({ message: "Error retrieving orders by status", error });
  }
};

// 4. Summary (Total Orders + Total Revenue)
exports.summary = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.send({
      totalOrders: orders.length,
      totalRevenue
    });

  } catch (error) {
    res.status(500).send({ message: "Error generating order summary", error });
  }
};

exports.chartData = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 2 }
    ]);

    // Format month names
    const labels = result
      .map(r =>
        new Date(r._id.year, r._id.month - 1).toLocaleString("en-US", {
          month: "long"
        }) +
        " " +
        String(r._id.year).slice(-2)
      )
      .reverse();

    const data = result.map(r => r.totalAmount).reverse();

    res.send({
      labels,
      datasets: [
        {
          label: "Order statistics",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }
      ]
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating chart data", error });
  }
};
exports.topSellingProducts = async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $unwind: "$products" }, // Break array into separate docs

      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" }
        }
      },

      { $sort: { totalSold: -1 } }, // Descending order
      { $limit: 10 },

      {
        $lookup: {
          from: "products",           // collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      { $unwind: "$productDetails" } // Convert array to object
    ]);

    res.status(200).send(results);

  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching top selling products",
      error
    });
  }
};