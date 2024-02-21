/*
handle departments requests
per route
*/
const express = require("express");
const router = express.Router();
const { handleAuthentication } = require("../commons/utils/handler");
const Controller = require("../controller/bbis-access");

// Set main api URL and service name
const apiUrl = "/access/authentication";
const routeUrlAccount = `${apiUrl}/account`;
const routeUrlDonor = `${apiUrl}/donor`;
const routeUrlSuperUser = `${apiUrl}/superUser`;
const routeUrlSuperAdmin = `${apiUrl}/superAdmin`;

// authenticate Account
router.post(routeUrlAccount, (req, res, next) =>
  handleAuthentication("authenticate", req, res, next, "Account", Controller)
);

// authenticate user
router.post(routeUrlDonor, (req, res, next) =>
  handleAuthentication("authenticate", req, res, next, "Donor", Controller)
);

// authenticate superUser
router.post(routeUrlSuperUser, (req, res, next) =>
  handleAuthentication("authenticate", req, res, next, "SuperUser", Controller)
);

// authenticate superAdmin
router.post(routeUrlSuperAdmin, (req, res, next) =>
  handleAuthentication("authenticate", req, res, next, "SuperAdmin", Controller)
);

module.exports = router;
