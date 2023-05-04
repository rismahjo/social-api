const connection = require('../config/connection');
const { User, Thought } = require('../models');

const userData = require('./userData.json');
const thoughtData = require('./thoughtData.json');

console.time('Seeding...');

connection.once('open', async () => {
    // Delete all data from database
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Empty array for thoughts
    const thoughts = [];

    // Create users using userdata
    await User.insertMany(userData);

    // Create thoughts with thoughtdata
    await Thought.insertMany(thoughtData);
});

console.log('Seeding finished!');