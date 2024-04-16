const jwt = require("jsonwebtoken");
const config = require("../config/app-config");

const generateToken = (payload) => {
    return jwt.sign(payload, config.secret,
        { expiresIn: 60 * 60 * 24 });
    };

module.exports = generateToken;