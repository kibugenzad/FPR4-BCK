const express = require("express");
const router = express.Router();
const { handleRequest } = require("../commons/utils/handler");
const Controller = require("../controller/bbis-access");
const isAlreadyClubMember = require("../commons/middleware/IsalreadyClubMember");

// Set main api URL and service name
const apiUrl = "/access";
const routeUrl = `${apiUrl}/club`;
const serviceName = "Club";
const clubMemberService = "ClubMember";

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

//add member to club
router.post(`${routeUrl}/addMember`,isAlreadyClubMember, (req, res, next) => handleRequest(
    "addMember", req, res, next, clubMemberService, Controller
));

//remove member from club
router.put(`${routeUrl}/removeMember`, (req, res, next) => handleRequest(
    "removeMember", req, res, next, clubMemberService, Controller
));

module.exports = router;

