require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Create JWT token for authentication
const token = jwt.sign({ some: "data" }, PRIVATE_KEY, { algorithm: "RS256" });

const microserviceBaseUrl = process.env.ACCESS_MICROSERVICE_URL || `${config.accessMicroserviceUrl}/api/access/department`;
const gatewayAPIUrl = "/access/department";

const makeRequest = async (method, req, res) => {
  const url = `${microserviceBaseUrl}${req.url.replace(gatewayAPIUrl, "")}`;
  try {
    const response = await axios({
      method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {};
    res.status(status).json(data);
  }
};

router.get(gatewayAPIUrl, (req, res) => makeRequest("get", req, res));
router.post(gatewayAPIUrl, (req, res) => makeRequest("post", req, res));
router.put(gatewayAPIUrl, (req, res) => makeRequest("put", req, res));
router.delete(gatewayAPIUrl, (req, res) => makeRequest("delete", req, res));

module.exports = router;
