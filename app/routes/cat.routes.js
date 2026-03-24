module.exports = app => {
  const cats = require("../controllers/cat.controller.js");
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
  router.post("/", upload.single("file"), cats.create);

  // test
  // Retrieve all cats
  router.get("/", cats.findAll);

  // Retrieve all published cats
  router.get("/active", cats.findAllActive);

  router.get("/check", cats.checkDuplicateCategory);

  // Retrieve a single cat with id
  router.get("/:id", cats.findOne);

  // Update a cat with id
  router.put("/:id", cats.update);

  // Delete a cat with id
  router.delete("/:id", cats.delete);

  // Create a new student
  router.delete("/", cats.deleteAll);

  app.use("/api/cats", router);
};
