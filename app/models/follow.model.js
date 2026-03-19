const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The one who follows
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The one being followed
  followedAt: { type: Date, default: Date.now }
});

FollowSchema.index({ follower: 1, following: 1 }, { unique: true }); // Prevent duplicate follows

module.exports = mongoose.model('Follow', FollowSchema);
