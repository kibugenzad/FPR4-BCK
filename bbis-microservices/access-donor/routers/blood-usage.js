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
const routeUrl = `${apiUrl}/bloodUsage`;
const serviceName = "BloodUsage";

// get data
router.get(routeUrl, (req, res, next) => handleRequest(
    "get", req, res, next, serviceName, Controller
));

// create data
router.post(routeUrl, (req, res, next) => handleRequest(
    "post", req, res, next, serviceName, Controller
));

// update data
router.put(routeUrl, (req, res, next) => handleRequest(
    "put", req, res, next, serviceName, Controller
));

// delete data
router.delete(routeUrl, (req, res, next) => handleRequest(
    "delete", req, res, next, serviceName, Controller
));

module.exports = router;
