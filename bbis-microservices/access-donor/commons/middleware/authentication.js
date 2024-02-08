const jwt = require("jsonwebtoken");
const Controller = require("../../controller/bbis-access");
const appConfig = require("../config/app-config");
const path = require("path");
const fs = require("fs");

const publicKeyPath = path.join(__dirname, "../.keys", "public_key.pem");
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, "utf8");
const KEY_PASSPHRASE = process.env.KEY_PASSPHRASE || "";
const ACCESS_ROLE_SERVICE_NAME = "AccessRole";
const GET_METHOD = "get";

const authenticateGateway = async (req, res, next) => {
  const isAuthUrl = appConfig.authUrls.includes(req.path.toLowerCase());
  // Check if the URL is in the whitelist
  const isWhitelisted = appConfig.whitelistedUrls.includes(
    req.path.toLowerCase()
  );

  const bearerHeader = req.headers.Authorization || req.headers.authorization;
  const hasBearerHeader =
    (typeof bearerHeader !== "undefined" &&
      !bearerHeader.includes("undefined") &&
      bearerHeader !== "") ||
    (req.method !== "GET" && !isAuthUrl && !isWhitelisted);

  console.log({
    path: req.path.toLowerCase(),
    bearerHeader,
    hasBearerHeader,
    isWhitelisted,
  });

  // Validate token if URL is not whitelisted or if a token is provided.
  if (!isWhitelisted && !hasBearerHeader) {
    return res.status(403).json({ error: "Forbidden: No Token Provided" });
  }

  if (!isWhitelisted || hasBearerHeader) {
    console.log({ bearerHeader });

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    try {
      const method = req.method;
      const decoded = await jwt.verify(bearerToken, appConfig.secret);
      let { accountType, accessRoleId } = decoded;

      if (false) {
        if (accessRoleId) {
          var reqAccessRole = { body: { id: accessRoleId } };
          var [accessRole] = await Controller[GET_METHOD](
            reqAccessRole,
            ACCESS_ROLE_SERVICE_NAME
          );

          console.log(accessRole);
        }

        if (
          accessRole &&
          accessRole.permissions &&
          accessRole.permissions.operationPaths &&
          accessRole.permissions.operationPaths[`_${method}`]
        ) {
          const operationPaths =
            accessRole.permissions.operationPaths[`_${method}`];

          if (!operationPaths.includes(req.path)) {
            return res.status(403).json({ error: "Forbidden: Access Denided" });
          }
        } else if (appConfig.userRoles.includes(accountType)) {
          if (!appConfig.userWhitelistedPaths.includes(req.path)) {
            return res.status(403).json({ error: "Forbidden: Access Denided" });
          }
        } else if (!appConfig.superAdminRoles.includes(accountType)) {
          return res.status(403).json({ error: "Forbidden: Access Denided" });
        }

        if (
          !appConfig.adminRoles.includes(accountType) &&
          !appConfig.userWhitelistedPaths.includes(req.path)
        ) {
          return res.status(403).json({ error: "Forbidden: Access Denided" });
        }

        if (
          !appConfig.adminRoles.includes(accountType) &&
          !appConfig.userWhitelistedPaths.includes(req.path)
        ) {
          console.log("here 5");
          return res.status(403).json({ error: "Forbidden: Access Denided" });
        }
      }
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
