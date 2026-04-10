const db = require("../models");
const Wishlist = db.wishlists;


exports.create = async (req, res) => {
  try {
    const { userId, productId, status = true } = req.body;

    if (!userId || !productId) {
      return res.status(400).send({
        message: "User and Product are required!"
      });
    }

    // Prevent duplicate wishlist item
    // how to solve in frontend
    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) {
      return res.status(409).send({
        message: "Product already exists in wishlist"
      });
    }

    const wishlist = new Wishlist({
      userId,
      productId,
      status
    });

    const data = await wishlist.save();
    res.status(201).send(data);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Wishlist."
    });
  }
};


exports.findAll = async (req, res) => {
  try {
    const data = await Wishlist.find()
      .populate("userId")
      .populate("productId");

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving wishlist."
    });
  }
};


exports.findByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: "productId",
        model: "Ssproduct"
      });

    res.status(200).send(wishlist);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving wishlist for user=" + req.params.userId
    });
  }
};


exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Wishlist.findById(id)
      .populate("userId")
      .populate("productId");

    if (!data) {
      return res.status(404).send({
        message: "Not found Wishlist with id " + id
      });
    }

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Wishlist with id=" + req.params.id
    });
  }
};


exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const id = req.params.id;

    const data = await Wishlist.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!data) {
      return res.status(404).send({
        message: `Cannot update Wishlist with id=${id}. Maybe not found!`
      });
    }

    res.send({
      message: "Wishlist was updated successfully.",
      data
    });

  } catch (err) {
    res.status(500).send({
      message: "Error updating Wishlist with id=" + req.params.id
    });
  }
};


exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Wishlist.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send({
        message: `Cannot delete Wishlist with id=${id}. Maybe not found!`
      });
    }

    res.send({
      message: "Wishlist item was deleted successfully!"
    });

  } catch (err) {
    res.status(500).send({
      message: "Could not delete Wishlist with id=" + req.params.id
    });
  }
};


exports.deleteAll = async (req, res) => {
  try {
    const data = await Wishlist.deleteMany({});

    res.send({
      message: `${data.deletedCount} Wishlist items were deleted successfully!`
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all Wishlist items."
    });
  }
};
