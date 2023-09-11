/*
aunthenticate gateway
*/

const jwt = require("jsonwebtoken");

// Public key for verification. This should ideally be stored in an environment variable.
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`;

const authenticateGateway = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden: Invalid Token" });
      }

      req.apiGateway = payload;  // Add payload to request to be extended
      next();
    });
  } else {
    res.status(403).json({ error: "Forbidden: No Token Provided" });
  }
};

module.exports = {
  authenticateGateway
};
