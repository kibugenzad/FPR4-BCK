require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");

const privateKeyPath = path.join(__dirname, "../.keys", "private_key.pem");
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");
const KEY_PASSPHRASE = process.env.KEY_PASSPHRASE || "";

const getFileExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return "";
  }
  return filename.substring(lastDotIndex + 1);
};

const generateJWT = (data) => {
  return jwt.sign(
    data,
    { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
    { algorithm: "RS256" }
  );
};

const handleFileUpload = (dataToSend, req) => {
  const directoryPath = path.join(__dirname, "../../public", "files");

  dataToSend.questionnaireAnswer &&
    dataToSend.questionnaireAnswer.forEach((qa, index) => {
      if (qa.answerType === "file") {
        const key = `questionnaireAnswer[${index}].answer`;
        if (req.files && fs.existsSync(req.files[key].path)) {
          const filePath = req.files[key].path;
          const filePathName = req.files[key].name;
          const fileName =
            (
              Math.random().toString(36).replace("0.", "").slice(0, 1) +
              [...Array(25)]
                .map(() => ((Math.random() * 36) | 0).toString(36))
                .join("")
            ).toLowerCase() + `.${getFileExtension(filePathName)}`;

          const newFilePath = path.join(directoryPath, fileName);
          fs.renameSync(filePath, newFilePath);
          dataToSend.questionnaireAnswer[index].answer = "files/" + fileName;
        }
      }
    });
  return dataToSend;
};

const makeAxiosRequest = async (options) => {
  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error;
  }
};

const getRequestOptions = (method, url, dataToSend, req, headers = {}) => {
  const token = req.headers.Authorization || req.headers.authorization;
  return {
    method,
    url,
    data: dataToSend,
    params: req.query,
    headers: {
      Authorization: token || "",
      ...(dataToSend instanceof FormData ? dataToSend.getHeaders() : {}),
      ...headers,
    },
  };
};

const makeRequest = async (
  microserviceBaseUrl,
  gatewayAPIUrl,
  method,
  req,
  res
) => {
  const url = `${microserviceBaseUrl}${gatewayAPIUrl}`;

  let dataToSend = { ...req.body, ...req.fields };
  if (dataToSend.questionnaireAnswer || req.files) {
    dataToSend = handleFileUpload(dataToSend, req);
  }

  try {
    const options = getRequestOptions(method, url, dataToSend, req);
    const response = await makeAxiosRequest(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : {};
    res.status(status).json(data);
  }
};

const makeRequestForMultipleRoles = async (
  microserviceBaseUrl,
  gatewayAPIUrl,
  roles,
  req,
  res
) => {
  let dataToSend = { ...req.body, ...req.fields };
  if (dataToSend.questionnaireAnswer || req.files) {
    dataToSend = handleFileUpload(dataToSend, req);
  }

  for (const role of roles) {
    const url = `${microserviceBaseUrl}${gatewayAPIUrl}/${role}`;

    try {
      const options = getRequestOptions("post", url, dataToSend, req);
      const response = await makeAxiosRequest(options);

      if (response.status === 200 && response.data.status !== "error") {
        return res.status(200).json({ ...response.data, role });
      }
    } catch (error) {
      console.log(`Request failed for role ${role}:`, error);
    }
  }

  res.status(401).json({
    message:
      "Request failed for admin authentication. Wrong username or password.",
  });
};

const makeRequestAndNotify = async (
  microserviceBaseUrl,
  gatewayAPIUrl,
  microserviceBaseUrlNotify,
  notifyAPIUrl,
  method,
  req,
  res
) => {
  const url = `${microserviceBaseUrl}${gatewayAPIUrl}`;
  const notifyUrl = `${microserviceBaseUrlNotify}${notifyAPIUrl}`;

  let dataToSend = { ...req.body, ...req.fields };
  if (dataToSend.questionnaireAnswer || req.files) {
    dataToSend = handleFileUpload(dataToSend, req);
  }

  try {
    const options = getRequestOptions(method, url, dataToSend, req);
    const response = await makeAxiosRequest(options);

    res.status(200).json(response.data);

    if (
      response.status === 200 &&
      response.data.status !== "error" &&
      notifyAPIUrl
    ) {
      const notifyOptions = getRequestOptions(
        method,
        notifyUrl,
        response.data,
        req
      );
      const responseNotify = await makeAxiosRequest(notifyOptions);

      if (
        responseNotify.status === 200 &&
        responseNotify.data.status !== "error"
      ) {
        let io = req.app.get("socketio");
        io.emit("notification", responseNotify.data);
      }
    }
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : {};
    res.status(status).json(data);
  }
};

module.exports = {
  makeRequest,
  makeRequestForMultipleRoles,
  makeRequestAndNotify,
};
