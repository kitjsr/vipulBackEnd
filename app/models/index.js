const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];
db.students = require("./student.model.js")(mongoose);
db.qpapers = require("./qpaper.model.js")(mongoose);
db.publishers = require("./publisher.model.js")(mongoose);
db.cats = require("./cat.model.js")(mongoose);
db.customers = require("./customer.model.js")(mongoose);
db.books = require("./book.model.js")(mongoose);
db.courses = require("./course.model.js")(mongoose);
db.branches = require("./branch.model.js")(mongoose);
db.bissues = require("./bissue.model.js")(mongoose);
db.products = require("./product.model.js"); 
db.ssproducts = require("./ssproduct.model.js"); 

db.profiles = require("./profile.model.js")(mongoose);
db.questions = require("./question.model.js")(mongoose);
db.answers = require("./answer.model.js")(mongoose);
db.comments = require("./comment.model.js")(mongoose);
db.votes = require("./vote.model.js")(mongoose);
db.carts = require("./cart.model.js")(mongoose);
db.orders = require("./order.model.js")(mongoose);
db.ssorders = require("./ssorder.model.js")(mongoose);
db.follows = require("./follow.model.js")(mongoose);
db.addresses = require("./address.model.js")(mongoose);
db.wishlists = require("./wishlist.model.js")(mongoose);

module.exports = db;
