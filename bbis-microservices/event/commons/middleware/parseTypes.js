const mongoose = require("mongoose");
const appConfig = require("../config/app-config");

const parseSpecialTypes = (req, res, next) => {
  req.params = { ...req.query, ...req.params };

  const isNumericString = (value) => {
    if (typeof value !== "string") return false;
    return !isNaN(value) && !isNaN(parseFloat(value));
  };

  const convertIfObjectId = (value) => {
    if (
      typeof value === "string" &&
      value.length === 24 &&
      mongoose.Types.ObjectId.isValid(value)
    ) {
      return mongoose.Types.ObjectId(value);
    }
    return value;
  };

  const tryParseJSON = (jsonString) => {
    try {
      const obj = JSON.parse(jsonString);
      // Recursively convert ObjectIds if present
      if (Array.isArray(obj)) {
        return obj.map(convertIfObjectId);
      } else if (typeof obj === "object") {
        for (const key in obj) {
          obj[key] = convertIfObjectId(obj[key]);
        }
      }
      return obj;
    } catch (e) {
      return null;
    }
  };

  const tryParseSpecialIdentifierArray = (string) => {
    if (typeof string !== "string") {
      return null; // Return null or throw an error
    }

    const regex = /^\[([a-zA-Z0-9,]+)\]$/;
    const match = string.match(regex);
    if (match) {
      return match[1].split(",").map(convertIfObjectId);
    }
    return null;
  };

  const parseObject = (obj) => {
    for (const key in obj) {
      const value = obj[key];
      if (value === "true") {
        obj[key] = true;
      } else if (value === "false") {
        obj[key] = false;
      } else if (isNumericString(value)) {
        // parse to number
        obj[key] = Number(value); // Added this line
      } else {
        const parsedIdentifierArray = tryParseSpecialIdentifierArray(value);
        const parsedValue = tryParseJSON(value);

        if (parsedIdentifierArray !== null || parsedValue !== null) {
          obj[key] = parsedIdentifierArray || parsedValue;
        } else {
          obj[key] = convertIfObjectId(value);
        }
      }
    }
  };

  parseObject(req.params);
  parseObject(req.body);
  parseObject(req.query);

  req.body = { ...req.params, ...req.body, ...req.query };

  console.log("request received on route: ", req.originalUrl);
  console.log("____________________________________________");
  console.log({ body: req.body });

  next();
};

const parseNotificationType = (req, res, next) => {
  try {
    if (
      appConfig.notificationUrl.includes(req.path.toLowerCase()) &&
      req.method.includes(["Post", "Put"])
    ) {
      const { decodedToken, ...restOfBody } = req.body;
      // Validate req.body structure and types to ensure it adheres to expected format
      if (
        !req.body ||
        !req.body.service ||
        !Array.isArray(req.body.service.approver) ||
        !req.body.user
      ) {
        // Handle the error case where data is not as expected
        res.status(422).send("Unexpected Format!");
        return;
      }

      let accounts = req.body.service.approver;

      // structure body as expected
      req.body = {
        body: JSON.stringify({ ...restOfBody }),
        accounts,
        user: restOfBody.user,
      };

      console.log("Parsed notification body: ", req.body);

      next();
    } else {
      next();
    }
  } catch (error) {
    // Handle any unexpected errors
    next(error);
  }
};

module.exports = { parseSpecialTypes, parseNotificationType };
