const User = require('../models/User');

const followController = {};

followController.follow = async (req, res) => {
  try {
    const userId = req.user._id;
    const followId = req.params.id;

    // Adicionar à lista de seguidores
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: followId }
    });

    // Adicionar à lista de seguidores
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

    // Remover da lista de seguidores
    await User.findByIdAndUpdate(userId, {
      $pull: { following: unfollowId }
    });

    // Remover da lista de seguidores
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
