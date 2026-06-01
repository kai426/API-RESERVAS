const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// Load models
const User = require('./User')(sequelize);
const Reservation = require('./Reservation')(sequelize);

const models = { User, Reservation };

// Run associations
Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

module.exports = { sequelize, ...models };