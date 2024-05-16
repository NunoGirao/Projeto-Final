const User = require('../models/User');

const followController = {};

followController.follow = async (req, res) => {
    try {
        const userId = req.user._id;
        const followId = req.params.id;

        // Add to following list
        await User.findByIdAndUpdate(userId, {
            $addToSet: { following: followId }
        });

        // Add to followers list
        await User.findByIdAndUpdate(followId, {
            $addToSet: { followers: userId }
        });

        res.status(200).json({ message: 'User followed successfully' });
    } catch (err) {
        console.error('Error following user:', err);
        res.status(500).json({ message: 'Error following user', error: err });
    }
};

followController.unfollow = async (req, res) => {
    try {
        const userId = req.user._id;
        const unfollowId = req.params.id;

        // Remove from following list
        await User.findByIdAndUpdate(userId, {
            $pull: { following: unfollowId }
        });

        // Remove from followers list
        await User.findByIdAndUpdate(unfollowId, {
            $pull: { followers: userId }
        });

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (err) {
        console.error('Error unfollowing user:', err);
        res.status(500).json({ message: 'Error unfollowing user', error: err });
    }
};

module.exports = followController;
