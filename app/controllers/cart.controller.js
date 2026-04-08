const db = require("../models");
const Cart = db.carts;
const mongoose = require("mongoose");
// const Product = require("../models/product.model");
// Create or update Cart (add items)
exports.create = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ message: "Missing required fields." });
  }

  const { productId, quantity, price } = items[0]; // assume single item for now

  if (!productId || !quantity || !price) {
    return res.status(400).send({ message: "Missing required item fields." });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price }],
        active: true
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price });
      }
    }

    const savedCart = await cart.save();
    res.send(savedCart);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error creating/updating cart."
    });
  }
};

// Retrieve all carts
exports.findAll = (req, res) => {
  Cart.find()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving carts."
      });
    });
};

// Find a single cart by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Cart.findById(id)
    .then(data => {
      if (!data) res.status(404).send({ message: `Cart not found with id=${id}` });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving cart with id=" + id });
    });
};


// Find a cart by userId with populated product details
// const mongoose = require("mongoose");
const Product = require("../models/product.model"); // adjust path as needed

exports.findByUserId = async (req, res) => {
  const userId = req.params.userId;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: "Invalid userId format" });
  }

  try {
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Find cart by userId
    const cart = await Cart.findOne({ userId: userObjectId }).lean();

    if (!cart) {
      return res.status(404).send({ message: `Cart not found for userId=${userId}` });
    }

    // For each item, fetch product details and attach
    const updatedItems = await Promise.all(
  cart.items.map(async (item) => {
    let productDetails = null;
    try {
      // Convert productId string to ObjectId
      const productObjectId = mongoose.Types.ObjectId(item.productId);
      productDetails = await Product.findById(productObjectId).lean();
    } catch (err) {
      console.error(`Error fetching product ${item.productId}:`, err);
    }

    return {
      ...item,
      productDetails,
    };
  })
);
const itemCount = cart.items.length;
    // Return cart with populated productDetails
    res.send({
      ...cart,
      items: updatedItems,
      itemCount
    });
  } catch (err) {
    console.error("Error retrieving cart:", err);
    res.status(500).send({ message: "Error retrieving cart for userId=" + userId });
  }
};

// Update a cart
exports.update = (req, res) => {
  const id = req.params.id;

  Cart.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update cart with id=${id}. Not found!` });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating cart with id=" + id });
    });
};

// Delete a cart
exports.delete = (req, res) => {
  const id = req.params.id;

  Cart.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete cart with id=${id}. Not found!` });
      } else {
        res.send({ message: "Cart was deleted successfully!" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete cart with id=" + id });
    });
};

// Delete all carts
exports.deleteAll = (req, res) => {
  Cart.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} carts deleted.` });
    })
    .catch(err => {
      res.status(500).send({ message: "Error deleting all carts." });
    });
};

// Find all active carts
exports.findAllActive = (req, res) => {
  Cart.find({ active: true })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({ message: "Error retrieving active carts." });
    });
};

// Update quantity of item in the cart
exports.updateItemQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send({ message: "Invalid userId or productId format" });
  }

  if (!quantity || typeof quantity !== "number" || quantity < 1) {
    return res.status(400).send({ message: "Quantity must be a positive number." });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).send({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).send({ message: "Item not found in cart." });
    }

    cart.items[itemIndex].quantity = quantity;

    const updatedCart = await cart.save();
    res.send(updatedCart);
  } catch (err) {
    res.status(500).send({ message: err.message || "Failed to update item quantity." });
  }
};

// Delete item from the cart
exports.deleteItem = async (req, res) => {
  const { userId, productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send({ message: "Invalid userId or productId format" });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).send({ message: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).send({ message: "Item not found in cart." });
    }

    const updatedCart = await cart.save();
    res.send(updatedCart);
  } catch (err) {
    res.status(500).send({ message: err.message || "Failed to delete item from cart." });
  }
};


exports.deleteByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: "Invalid userId format" });
  }

  try {
    const deletedCart = await Cart.findOneAndDelete({ userId });

    if (!deletedCart) {
      return res.status(404).send({ message: `No cart found for userId=${userId}` });
    }

    res.send({ message: "Cart deleted successfully!", cart: deletedCart });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error deleting cart for userId " + userId
    });
  }
};

