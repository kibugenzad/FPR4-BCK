const express = require("express");
const router = express.Router();
const axios = require("axios");
const { makeRequest } = require("../commons/utils/handler");
const config = require("../commons/config/app-config");

const microserviceBaseUrl =
  process.env.ACCESS_MICROSERVICE_URL || `${config.accessMicroserviceUrl}`;
const gatewayAPIUrl = "/access/nida";


router.post(gatewayAPIUrl, (req, res) =>
    makeRequest(microserviceBaseUrl, gatewayAPIUrl, "post", req, res)
    );

module.exports = router;