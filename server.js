const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
var path=require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();


var corsOptions = {
  credentials: true,
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
/* for Angular Client (withCredentials) */
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:8081"],
//   })
// );


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "kit-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to backend application." });
});
///////////
// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
//////////////
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const ename = req.body.ename;
    const qname = req.body.qname;
    const file = req.file;

    console.log('Title:', ename);
    console.log('Title:', qname);
    console.log('File:', file);

    // Process the file and title here...
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send('Server error');
  }
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filePath);
});

app.get('/upload/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'app/uploads', filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File send error:", err);
      res.status(404).send("File not found");
    }
  });
});

//////////////
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/student.routes")(app);
require("./app/routes/qpaper.routes")(app);
require("./app/routes/publisher.routes")(app);
require("./app/routes/cat.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/book.routes")(app);
require("./app/routes/course.routes")(app);
require("./app/routes/branch.routes")(app);
require("./app/routes/bissue.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/ssproduct.routes")(app);
require("./app/routes/profile.routes")(app);
require("./app/routes/question.routes")(app);
require("./app/routes/answer.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/ssorder.routes")(app);
require("./app/routes/follow.routes")(app);
require("./app/routes/address.routes")(app);
require("./app/routes/wishlist.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Vipul Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

