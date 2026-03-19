module.exports = app => {
  const follow = require("../controllers/follow.controller.js");
  const { verifyToken } = require("../middlewares/authJwt.js");

  const router = require("express").Router();

  // Follow a user
  router.post("/:id", verifyToken, follow.followUser);

  // Unfollow a user
  router.delete("/:id", verifyToken, follow.unfollowUser);

  // Get a user's followers
  router.get("/:id/followers", follow.getFollowers);

  // Get who a user is following
  router.get("/:id/following", follow.getFollowing);

  // Get count of followers and following
  router.get("/:id/counts", follow.getFollowCounts);

  app.use("/api/follow", router);
};
