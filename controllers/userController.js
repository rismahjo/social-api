const { User, Thought } = require('../models');

module.exports = {
    //Get users
    getUsers (req, res) {
        User.find()
            .then((users) => {
                return res.json(users);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get single user by id and populate any thought/friend data
    getSingleUser (req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with this id' })
                    : res.json(user)    
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Create new user
    createUser (req, res) {
        User.create(req.body)
            .then((user) => {
                return res.json(user)
            })
            .catch((err) => {
                return res.status(500).json(err)
            });
    },
    // Update user by id
    updateUser (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id' })
                    : res.json({
                        updatedUser: user,
                        message: 'User updated'
                    }) 
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete user by id
    deleteUser (req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this id' })
                }
                // Remove user's thoughts when deleted
                Thought.deleteMany({ _id: { $in: user.thoughts } })
                return res.json({
                    deletedUser: user,
                    message: 'User and associated thoughts deleted'
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // Add new friend to friend list of user
    addFriend (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id' })
                    : res.json({
                        updatedUser: user,
                        message: 'Friend added'
                    })
            )
            .catch((err) => {
                return res.status(500).json(err)
            });
    },
    // Remove friend from friend list of user
    removeFriend (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json({
                        updatedUser: user,
                        message: 'Friend removed'
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    }
};