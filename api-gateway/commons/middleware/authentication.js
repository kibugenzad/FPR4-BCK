const asyncHandler = require("express-async-handler");
const appConfig = require("../config/app-config");

// Middleware for token verification
const tokenVerify = asyncHandler(async (req, res, next) => {
  // Preprocessing and validation
  const body = preprocessRequestBody(req);
  if (!body) {
    return res
      .status(422)
      .send({ success: false, message: "Invalid request body." });
  }

  // Authentication Logic
  if (!appConfig.no_token_urls.includes(req.originalUrl)) {
    return handleTokenAuthentication(req, res, next, body);
  }

  // Special URL Handling (Auth URLs and Forgot Password)
  return handleSpecialUrls(req, res, next, body);
});

const preprocessRequestBody = (req) => {
  let body =
    req.body && Object.keys(req.body).length > 0 ? req.body : req.fields;
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
