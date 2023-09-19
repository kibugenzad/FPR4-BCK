require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

privateKeyPath = path.join(__dirname, "../.keys", "private_key.pem");
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");
const KEY_PASSPHRASE = process.env.KEY_PASSPHRASE || "";

const makeRequest = async (
  microserviceBaseUrl,
  gatewayAPIUrl,
  method,
  req,
  res
) => {
  const url = `${microserviceBaseUrl}${gatewayAPIUrl}`;
  const body = jwt.sign(
    req.body,
    { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
    { algorithm: "RS256" }
  );
  const query = jwt.sign(
    req.query,
    { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
    { algorithm: "RS256" }
  );
  const token = req.headers.Authorization || req.headers.authorization;

  try {
    const response = await axios({
      method,
      url,
      data: req.body, // { hashedBody: body },
      params: req.query, // { hashedQuery: query },
      headers: {
        Authorization: token || "",
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : {};
    res.status(status).json(data);
  }
};

const makeRequestForMultipleRoles = async (
  microserviceBaseUrl,
  gatewayAPIUrl,
  roles,
  req,
  res
) => {
  const token = req.headers.Authorization || req.headers.authorization;

  for (const role of roles) {
    const url = `${microserviceBaseUrl}${gatewayAPIUrl}/${role}`;
    const body = jwt.sign(
      JSON.stringify(req.body),
      { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
      { algorithm: "RS256" }
    );
    const query = jwt.sign(
      JSON.stringify(req.query),
      { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
      { algorithm: "RS256" }
    );

    try {
      const response = await axios({
        method: "post",
        url,
        data: req.body, // { hashedBody: body },
        params: req.query, // { hashedQuery: query },
        headers: {
          Authorization: token || "",
        },
      });

      if (response.status === 200) {
        return res.status(200).json({ ...response.data, role });
      }
    } catch (error) {
      // Log the error and continue to the next role
      console.error(`Authentication failed for role ${role}:`, error);
    }
  }

  // If it reaches this point, all role authentications have failed
  res
    .status(401)
    .json({ message: "Authentication failed! Wrong username or password." });
};

module.exports = { makeRequest, makeRequestForMultipleRoles };
