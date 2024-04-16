const express = require("express");
const router = express.Router();
const axios = require("axios");
const { makeRequest } = require("../commons/utils/handler");
const config = require("../commons/config/app-config");

const microserviceBaseUrl =
  process.env.ACCESS_MICROSERVICE_URL || `${config.accessMicroserviceUrl}`;
const gatewayAPIUrl = "/access/accessRole";

router.get(gatewayAPIUrl, (req, res) =>
  makeRequest(microserviceBaseUrl, gatewayAPIUrl, "get", req, res)
);
router.post(gatewayAPIUrl, (req, res) =>
  makeRequest(microserviceBaseUrl, gatewayAPIUrl, "post", req, res)
);
router.put(gatewayAPIUrl, (req, res) =>
  makeRequest(microserviceBaseUrl, gatewayAPIUrl, "put", req, res)
);
router.delete(gatewayAPIUrl, (req, res) =>
  makeRequest(microserviceBaseUrl, gatewayAPIUrl, "delete", req, res)
);

module.exports = router;
