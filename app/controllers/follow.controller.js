const Follow = require('../models/follow.model');

// POST /api/follow/:id
exports.followUser = async (req, res) => {
  const followerId = req.userId; // ✅ Fix here
  const followingId = req.params.id;

  if (followerId === followingId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  try {
    const follow = new Follow({ follower: followerId, following: followingId });
    await follow.save();
    res.status(200).json({ message: "Followed successfully." });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Already following this user." });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

// DELETE /api/follow/:id
exports.unfollowUser = async (req, res) => {
  const followerId = req.userId; // ✅ Fix here
  const followingId = req.params.id;

  try {
    const result = await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    if (!result) {
      return res.status(400).json({ message: "Not following this user." });
    }
    res.status(200).json({ message: "Unfollowed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/follow/:id/followers
exports.getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.id })
      .populate('follower', 'username'); // adjust fields if needed

    res.status(200).json(followers.map(f => f.follower));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/follow/:id/following
exports.getFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.id })
      .populate('following', 'username'); // adjust fields if needed

    res.status(200).json(following.map(f => f.following));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/follow/:id/counts
exports.getFollowCounts = async (req, res) => {
  const userId = req.params.id;

  try {
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: userId })
    ]);

    res.status(200).json({ followers: followersCount, following: followingCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
