const jwt = require("jsonwebtoken");
const appConfig = require("../config/app-config");
const path = require("path");
const fs = require("fs");

const publicKeyPath = path.join(__dirname, "../.keys", "public_key.pem");
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, "utf8");
const KEY_PASSPHRASE = process.env.KEY_PASSPHRASE || "";

const authenticateGateway = async (req, res, next) => {
  const bearerHeader = req.headers.Authorization || req.headers.authorization;

  // Check if the URL is in the whitelist
  console.log({ reqPath: req.path });
  console.log("******_____________________________");
  const isWhitelisted = appConfig.whitelistedUrls.includes(
    req.path.toLowerCase()
  );

  console.log({ isWhitelisted });

  // Validate token if URL is not whitelisted or if a token is provided.
  if (!isWhitelisted) {
    if (typeof bearerHeader === "undefined" || bearerHeader === "") {
      return res.status(403).json({ error: "Forbidden: No Token Provided" });
    }

    console.log({ bearerHeader });

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    try {
      decoded = await jwt.verify(bearerToken, appConfig.secret);
      req.body.decodedToken = decoded;
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: "Forbidden: Invalid Token" });
    }
  }

  // Now decipher request body and query for all URLs, irrespective of whether they are whitelisted or not
  try {
    if (req.body && false) {
      // disable for now
      console.log({ body: req.body });
      const body = await jwt.verify(req.body.hashedBody, {
        key: PUBLIC_KEY,
        passphrase: KEY_PASSPHRASE,
      });
      req.body = JSON.parse(body);
      console.log({ body: req.body });
    }

    if (req.query && false) {
      // disable for now
      console.log({ query: req.query });
      const query = await jwt.verify(req.query.hashedQuery, {
        key: PUBLIC_KEY,
        passphrase: KEY_PASSPHRASE,
      });
      req.query = JSON.parse(query);
      console.log({ query: req.query });
    }
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: Invalid Key" });
  }

  next();
};

module.exports = {
  authenticateGateway,
};
