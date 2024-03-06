const express = require('express');
const router = express.Router();
const { handleRequest } = require('../commons/utils/handler');
const Controller = require('../controller/bbis-access');

const apiUrl = '/access';
const routeUrl = `${apiUrl}/vitalSign`;
const serviceName = 'VitalSign';

router.get(routeUrl, (req, res, next) => handleRequest(
    'get', req, res, next, serviceName, Controller
    ));


router.post(routeUrl, (req, res, next) => handleRequest(
    'post', req, res, next, serviceName, Controller
    ));


router.put(routeUrl, (req, res, next) => handleRequest(
    'put', req, res, next, serviceName, Controller
    ));


router.delete(routeUrl, (req, res, next) => handleRequest(
    'delete', req, res, next, serviceName, Controller
    ));


module.exports = router;


