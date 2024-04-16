/*
handle departments requests
per route
*/
const express = require("express");
const router = express.Router();
const { handleAuthentication } = require("../commons/utils/handler");
const Controller = require("../controller/fpr-access");

// Set main api URL and service name
const apiUrl = "/access/authentication";
const routeUrlAccount = `${apiUrl}/account`;
const routeUrlSuperAdmin = `${apiUrl}/superAdmin`;

// authenticate Account
router.post(routeUrlAccount, (req, res, next) =>
  handleAuthentication("authenticate", req, res, next, "Account", Controller)
);

// authenticate superAdmin
router.post(routeUrlSuperAdmin, (req, res, next) =>
  handleAuthentication("authenticate", req, res, next, "SuperAdmin", Controller)
);

module.exports = router;
