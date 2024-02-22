const express = require("express");
const router = express.Router();
const axios = require("axios");
const {
  makeRequest,
  makeRequestForMultipleRoles,
} = require("../commons/utils/handler");
const config = require("../commons/config/app-config");

const microserviceBaseUrl =
  process.env.ACCESS_MICROSERVICE_URL || `${config.accessMicroserviceUrl}`;
const gatewayAPIUrl = "/access/authentication";

router.post(`${gatewayAPIUrl}/admin`, (req, res) =>
  makeRequestForMultipleRoles(
    microserviceBaseUrl,
    gatewayAPIUrl,
    ["superAdmin", "superUser", "account"],
    req,
    res
  )
);

router.post(`${gatewayAPIUrl}/account`, (req, res) =>
  makeRequest(microserviceBaseUrl, `${gatewayAPIUrl}/account`, "post", req, res)
);

router.post(`${gatewayAPIUrl}/donor`, (req, res) =>
  makeRequest(microserviceBaseUrl, `${gatewayAPIUrl}/donor`, "post", req, res)
);
router.post(`${gatewayAPIUrl}/superUser`, (req, res) =>
  makeRequest(
    microserviceBaseUrl,
    `${gatewayAPIUrl}/superUser`,
    "post",
    req,
    res
  )
);
router.post(`${gatewayAPIUrl}/superAdmin`, (req, res) =>
  makeRequest(
    microserviceBaseUrl,
    `${gatewayAPIUrl}/superAdmin`,
    "post",
    req,
    res
  )
);

module.exports = router;
