module.exports = app => {
  const carts = require("../controllers/cart.controller.js");
  const router = require("express").Router();

  // Create or add to cart
  router.post("/", carts.create);

  // Retrieve all carts
  router.get("/", carts.findAll);

  // Retrieve active carts
  router.get("/active", carts.findAllActive);

  // Retrieve single cart by ID
  router.get("/:id", carts.findOne);

  // Retrieve cart by user ID
  router.get("/user/:userId", carts.findByUserId);

  // Update entire cart by ID
  router.put("/:id", carts.update);

  // Update quantity of item in cart
  router.put("/user/:userId/item/:productId", carts.updateItemQuantity);

  // Delete item from cart
  router.delete("/user/:userId/item/:productId", carts.deleteItem);

  // Delete a cart by ID
  router.delete("/:id", carts.delete);

  // Delete all carts
  router.delete("/", carts.deleteAll);

  // Delete Cart By User
  router.delete("/user/:userId", carts.deleteByUserId);

  app.use("/api/carts", router);
};
