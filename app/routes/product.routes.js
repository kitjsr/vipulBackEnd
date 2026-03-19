module.exports = app => {
  const products = require("../controllers/product.controller.js");
const fs = require("fs");
  const multer = require("multer");
  const path = require("path");
  const { v4: uuidv4 } = require("uuid"); 
  
  global.__basedir = __dirname;
  
  
  
  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };
  
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + "../../../uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() +
      path.extname(file.originalname));
    },
  });
  
  var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

  var router = require("express").Router();
  
  // Create a new User
  // router.post("/", users.create);
  // router.post("/", uploadFile.single("photo"),users.create);
  router.post("/", uploadFile.single("file"), products.create);
  

  // // Create a new product
  // router.post("/", products.create);

  // Retrieve all products
  router.get("/", products.findAll);

  // Retrieve all published products
  router.get("/active", products.findAllActive);

  // Retrieve a single product with id
  router.get("/:id", products.findOne);

  // Update a product with id
  router.put("/:id", products.update);

  // Delete a product with id
  router.delete("/:id", products.delete);

  // Create a new product
  router.delete("/", products.deleteAll);

  app.use("/api/products", router);
};
