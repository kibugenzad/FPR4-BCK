/*
handle departments requests
per route
*/
const express = require("express");
const router = express.Router();
const { handleRequest } = require("../commons/utils/handler");
const Controller = require("../controller/bbis-access");

// Set main api URL and service name
const apiUrl = "/access";
const routeUrl = `${apiUrl}/nida`;
const serviceName = "Nida";

// create data
router.post(routeUrl, (req, res, next) => handleRequest(
    "post", req, res, next, serviceName, Controller
));

module.exports = router;
