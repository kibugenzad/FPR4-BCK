const express = require('express');
const router = express.Router();

const { makeRequest } = require("../commons/utils/handler");
const config = require("../commons/config/app-config");

const microserviceBaseUrl =
    process.env.ACCESS_MICROSERVICE_URL || `${config.accessMicroserviceUrl}`;
const gatewayAPIUrl = "/access/club";

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

// add member to club
router.post(`${gatewayAPIUrl}/addMember`, (req, res) =>
    makeRequest(microserviceBaseUrl, `${gatewayAPIUrl}/addMember`, "post", req, res)
);

// remove member from club
router.put(`${gatewayAPIUrl}/removeMember`, (req, res) =>
    makeRequest(microserviceBaseUrl, `${gatewayAPIUrl}/removeMember`, "put", req, res)
);

module.exports = router;