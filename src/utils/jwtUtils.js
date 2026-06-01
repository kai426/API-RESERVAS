const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const generateToken = (payload) => {
    return jwt.sign(payload, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, authConfig.secret);
};

module.exports = { generateToken, verifyToken };
