module.exports = app => {
  const qpapers = require("../controllers/qpaper.controller.js");
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
  router.post("/upload", uploadFile.single("file"), qpapers.create);
  // Retrieve all Questions
  router.get("/upload", qpapers.findAll);
  
  // Retrieve One Questions
  router.get("/upload/:id", qpapers.findOne);

  // Update a question with id
  router.put("/upload/:id", qpapers.update);

  // Delete a question with id
  router.delete("/upload/:id", qpapers.delete);

  app.use("/api/qpapers", router);
};
