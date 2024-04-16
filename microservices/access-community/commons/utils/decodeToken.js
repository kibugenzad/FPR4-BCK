const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  let decoded = jwt.decode(token.split("Bearer ")[1]);
  return decoded;
};

module.exports = decodeToken;
