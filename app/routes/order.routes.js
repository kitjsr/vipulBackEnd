module.exports = app => {
  const orders = require("../controllers/order.controller.js");

  const router = require("express").Router();

  // Create a new Order
  router.post("/", orders.create);

  // Retrieve all Orders
  router.get("/", orders.findAll);

  // Retrieve all active Orders
  router.get("/active", orders.findAllActive);

  // Retrieve a single Order with id
  router.get("/:id", orders.findOne);

  // Update an Order with id
  router.put("/:id", orders.update);

  // Delete an Order with id
  router.delete("/:id", orders.delete);

  // Delete all Orders
  router.delete("/", orders.deleteAll);

  app.use("/api/orders", router);
};
