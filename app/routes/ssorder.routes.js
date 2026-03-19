module.exports = app => {
  const ssorders = require("../controllers/ssorder.controller.js");
  const router = require("express").Router();

  // CRUD
  router.post("/", ssorders.create);
  router.get("/", ssorders.findAll);

  // Chart
  router.get("/chartdata", ssorders.chartData);
  router.get("/top-selling-products", ssorders.topSellingProducts);

  // REPORTS
  router.get("/reports/daily", ssorders.dailyReport);
  router.get("/reports/summary", ssorders.summary);
  router.get("/reports/status/:status", ssorders.ordersByStatus);
  router.get("/reports/monthly/:year/:month", ssorders.monthlyReport);

  // User orders
  router.get("/user/:userId", ssorders.findByUser);

  //
  router.get("/:id", ssorders.findOne);
  router.put("/:id/status", ssorders.updateStatus);
  router.delete("/:id", ssorders.delete);

  app.use("/api/ssorders", router);
};
