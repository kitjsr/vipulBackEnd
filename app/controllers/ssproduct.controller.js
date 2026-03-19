const db = require("../models");
const Ssproduct = db.ssproducts;
const fs = require("fs");
//http://localhost:8090/uploads/7acef58e-da7a-4986-803e-6e717de80577.jpg
global.__basedir = __dirname;


// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    console.log("Hello SS");
    console.log(req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("You must select at least one file.");
    }

    const imageFilenames = req.files.map((file) => file.filename);

    const data = await Ssproduct.create({
      userId: req.body.userId,
      productName: req.body.productName,
      productCategory: req.body.productCategory,
      productPrice: req.body.productPrice,
      productGender: req.body.productGender,
      productOccasion: req.body.productOccasion,
      productDiscount: req.body.productDiscount,
      productMaterial: req.body.productMaterial,
      productDescription: req.body.productDescription,
      images: imageFilenames,
      active: req.body.active ? req.body.active : false,
    });

    res.status(201).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error when trying to upload images: ${error}`);
  }
};


// Retrieve all products from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Ssproduct.find(condition)
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

// Find a single Product with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Ssproduct.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Product with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Product with id=" + id });
    });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Ssproduct.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found!`
        });
      } else res.send({ message: "Product was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Ssproduct.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      } else {
        res.send({
          message: "Product was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};

// Delete all Product from the database.
exports.deleteAll = (req, res) => {
  Ssproduct.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Products were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Products."
      });
    });
};

// Find all published Products
exports.findAllActive = (req, res) => {
  Ssproduct.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products."
      });
    });
};
// Get latest products
exports.getNewArrivals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const data = await Ssproduct.find({})
      .sort({ createdAt: -1 })  // newest first
      .limit(limit);

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving new arrivals."
    });
  }
};


exports.getNewArrivalsMen = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const data = await Ssproduct.find({ productGender: "Men" })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving new arrivals for men."
    });
  }
};

exports.getNewArrivalsWomen = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const data = await Ssproduct.find({ productGender: "Women" })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving new arrivals for women."
    });
  }
};


exports.getProductsByCategory = (req, res) => {
  const category = req.params.category;
  console.log("Searching for category:", category);

  Ssproduct.find({ productCategory: { $regex: new RegExp(category, 'i') } })
    .then(data => {
      if (!data || data.length === 0) {
        return res.status(404).send({ message: "No products found in this category." });
      }
      res.send(data);
    })
    .catch(err => {
      console.error("Database query failed:", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};

// Get total number of products
exports.getTotalProducts = async (req, res) => {
  try {
    const total = await Ssproduct.countDocuments({});
    res.status(200).send({
      totalProducts: total
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while counting products",
      error: error.message
    });
  }
};

