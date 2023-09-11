const asyncHandler = require("express-async-handler");
const config = require("../../config");
const jwt = require("jsonwebtoken");
const Register = require("../../controller/register");

// Function to handle brute-force attack prevention
const protectBruteForceAuth = (user, reset) => {
  const currentTime = Math.floor(Date.now());
  const updatedUser = {...user};
  
  // Initialize user tracking if not present
  if (!user.number_auth_try || !user.number_auth_try.maximum_try) {
    updatedUser.number_auth_try = { maximum_try: 5, maximum_interval: 1000 * 60 * 30 };
  }

  // Reset the counter if the reset flag is set
  if (reset) {
    updatedUser.number_auth_try.current_num = 0;
    updatedUser.number_auth_try.last_seen = currentTime;
    updatedUser.number_auth_try.slow_effect = 1;
    return { updatedUser, isBruteForce: false };
  }

  // ... (Your existing code logic for the "else" block, just update "user" to "updatedUser")
};

// Function to determine user model
const getUserModel = async (req) => {
  // ... (Your existing logic)
};

// Middleware for token verification
const tokenVerify = asyncHandler(async (req, res, next) => {
  // Preprocessing and validation
  const body = preprocessRequestBody(req);
  if (!body) {
    return res.status(422).send({ success: false, message: "Invalid request body." });
  }

  // Authentication Logic
  if (!config.no_token_urls.includes(req.originalUrl)) {
    return handleTokenAuthentication(req, res, next, body);
  }

  // Special URL Handling (Auth URLs and Forgot Password)
  return handleSpecialUrls(req, res, next, body);
});

const preprocessRequestBody = (req) => {
  let body = req.body && Object.keys(req.body).length > 0 ? req.body : req.fields;
  if (body.amount) body.amount = parseFloat(req.body.amount);
  if (body.contact) body.contact = body.contact.replace("+", "");
  return body;
};

const handleTokenAuthentication = async (req, res, next, body) => {
  // ... (Your existing logic)
};

const handleSpecialUrls = async (req, res, next, body) => {
  // ... (Your existing logic)
};

module.exports = { tokenVerify };
