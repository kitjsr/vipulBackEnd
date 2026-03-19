module.exports = (app) => {
  const ssproducts = require("../controllers/ssproduct.controller.js");
  const express = require("express");
  const multer = require("multer");
  const path = require("path");
  const { v4: uuidv4 } = require("uuid");

  const router = express.Router();

  // Multer config
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads")); // Make sure this exists
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname));
    },
  });

  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Only images are allowed!", false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: imageFilter });

  // Create a new product with multiple images
  router.post("/", upload.array("images", 5), ssproducts.create);

  // Other product routes
  router.get("/", ssproducts.findAll);
  router.get("/active", ssproducts.findAllActive);
  router.get("/:id", ssproducts.findOne);
  router.put("/:id", ssproducts.update);
  router.delete("/:id", ssproducts.delete);
  router.delete("/", ssproducts.deleteAll);
  // New
  router.get("/new/all", ssproducts.getNewArrivals);
  router.get("/new/men", ssproducts.getNewArrivalsMen);
  router.get("/new/women", ssproducts.getNewArrivalsWomen);

  router.get("/products/count", ssproducts.getTotalProducts);
  router.get("/category/:category", ssproducts.getProductsByCategory);
  app.use("/api/ssproducts", router);
};
