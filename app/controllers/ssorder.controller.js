const db = require("../models");
const SsOrder = db.ssorders;

// =========================
// Create SS Order
// =========================
exports.create = async (req, res) => {
  try {
    const { userId, addressId, products } = req.body;

    if (!userId || !addressId || !products || products.length === 0) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Calculate total amount
    const totalAmount = products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const ssOrder = new SsOrder({
      userId,
      addressId,
      products,
      totalAmount
    });

    const savedOrder = await ssOrder.save();
    res.status(201).send(savedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating ss order", error });
  }
};

// =========================
// Get All Orders
// =========================
exports.findAll = async (req, res) => {
  var condition = {};

  SsOrder.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Orders."
      });
    });
};


// =========================
// Get Orders by User
// =========================
exports.findByUser = async (req, res) => {
  
var condition = {userId: req.params.userId};

  SsOrder.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Orders."
      });
    });
};

// =========================
// Get Single Order
// =========================
exports.findOne = async (req, res) => {
  try {
    const order = await SsOrder.findById(req.params.id)
      .populate("userId")
      .populate("addressId")
      .populate("products.productId");

    if (!order)
      return res.status(404).send({ message: "SS Order not found" });

    res.send(order);

  } catch (error) {
    res.status(500).send({ message: "Error retrieving ss order", error });
  }
};

// =========================
// Update Order Status
// =========================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await SsOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order)
      return res.status(404).send({ message: "SS Order not found" });

    res.send(order);

  } catch (error) {
    res.status(500).send({ message: "Error updating ss order status", error });
  }
};

// =========================
// Delete Order
// =========================
exports.delete = async (req, res) => {
  try {
    const order = await SsOrder.findByIdAndRemove(req.params.id);

    if (!order)
      return res.status(404).send({ message: "SS Order not found" });

    res.send({ message: "SS Order deleted successfully" });

  } catch (error) {
    res.status(500).send({ message: "Error deleting ss order", error });
  }
};

// ======================================================
// 📊 ORDER REPORTS
// ======================================================

// 1. Daily Orders Report
exports.dailyReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await SsOrder.find({
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

    const orders = await SsOrder.find({
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

    const orders = await SsOrder.find({ status });

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
    const orders = await SsOrder.find();

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
    const result = await SsOrder.aggregate([
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
    const results = await SsOrder.aggregate([
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
          from: "ssproducts",           // collection name in MongoDB
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