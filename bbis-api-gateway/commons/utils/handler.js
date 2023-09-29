require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");

privateKeyPath = path.join(__dirname, "../.keys", "private_key.pem");
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");
const KEY_PASSPHRASE = process.env.KEY_PASSPHRASE || "";

const getFileExtension = (filename) => {
  // Find the last occurrence of dot in the filename
  const lastDotIndex = filename.lastIndexOf(".");

  // If there is no dot, or it's the last character, return an empty string
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return "";
  }

  // Return the substring after the last dot
  return filename.substring(lastDotIndex + 1);
};

const makeRequest = async (
  microserviceBaseUrl,
  gatewayAPIUrl,
  method,
  req,
  res
) => {
  const url = `${microserviceBaseUrl}${gatewayAPIUrl}`;

  // Generate JWT tokens for body and query
  const body = jwt.sign(
    req.body,
    { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
    { algorithm: "RS256" }
  );
  const query = jwt.sign(
    req.query,
    { key: PRIVATE_KEY, passphrase: KEY_PASSPHRASE },
    { algorithm: "RS256" }
  );

  const token = req.headers.Authorization || req.headers.authorization;
  let dataToSend = { ...req.body, ...req.fields };
  console.log(req.files);

  if (dataToSend.questionnaireAnswer || req.files) {
    let isFormData = false;
    const formData = new FormData();

    // Define the directory where the files will be saved
    const directoryPath = path.join(__dirname, "../../public", "files");

    dataToSend.questionnaireAnswer &&
      dataToSend.questionnaireAnswer.forEach((qa, index) => {
        if (qa.answerType === "file") {
          let key = `questionnaireAnswer[${index}].answer`;
          if (req.files && fs.existsSync(req.files[key].path)) {
            let filePath = req.files[key].path;
            let filePathName = req.files[key].name;

            const fileName =
              (
                Math.random().toString(36).replace("0.", "").slice(0, 1) +
                [...Array(25)]
                  .map(() => ((Math.random() * 36) | 0).toString(36))
                  .join("")
              ).toLowerCase() + `.${getFileExtension(filePathName)}`; // random 26 char string

            const newFilePath = path.join(directoryPath, fileName);

            // Move the file to the new directory
            fs.renameSync(filePath, newFilePath);

            dataToSend.questionnaireAnswer[index].answer = "files/" + fileName;
          }
        }
      });

    // if (isFormData) {
    //   // Combining formData with the rest of the data
    //   Object.keys(dataToSend).forEach((key) => {
    //     if (key !== "questionnaireAnswer")
    //       formData.append(key, dataToSend[key]);
    //   });
    //   dataToSend = formData;
    // }
  }

  // Make the request
  try {
    const response = await axios({
      method,
      url,
      data: dataToSend,
      params: req.query,
      headers: {
        Authorization: token || "",
        ...(dataToSend instanceof FormData ? dataToSend.getHeaders() : {}),
      },
    });

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
  const token = req.headers.Authorization || req.headers.authorization;

  for (const role of roles) {
    const url = `${microserviceBaseUrl}${gatewayAPIUrl}/${role}`;

    const token = req.headers.Authorization || req.headers.authorization;

    let dataToSend = { ...req.body, ...req.fields };
    console.log(req.files);

    if (dataToSend.questionnaireAnswer || req.files) {
      let isFormData = false;
      const formData = new FormData();

      // Define the directory where the files will be saved
      const directoryPath = path.join(__dirname, "../../public", "files");

      dataToSend.questionnaireAnswer &&
        dataToSend.questionnaireAnswer.forEach((qa, index) => {
          if (qa.answerType === "file") {
            let key = `questionnaireAnswer[${index}].answer`;
            if (req.files && fs.existsSync(req.files[key].path)) {
              let filePath = req.files[key].path;
              let filePathName = req.files[key].name;

              const fileName =
                (
                  Math.random().toString(36).replace("0.", "").slice(0, 1) +
                  [...Array(25)]
                    .map(() => ((Math.random() * 36) | 0).toString(36))
                    .join("")
                ).toLowerCase() + `.${getFileExtension(filePathName)}`; // random 26 char string

              const newFilePath = path.join(directoryPath, fileName);

              // Move the file to the new directory
              fs.renameSync(filePath, newFilePath);

              dataToSend.questionnaireAnswer[index].answer =
                "files/" + fileName;
            }
          }
        });

      // if (isFormData) {
      //   // Combining formData with the rest of the data
      //   Object.keys(dataToSend).forEach((key) => {
      //     if (key !== "questionnaireAnswer")
      //       formData.append(key, dataToSend[key]);
      //   });
      //   dataToSend = formData;
      // }
    }

    try {
      const response = await axios({
        method: "post",
        url,
        data: dataToSend,
        params: req.query,
        headers: {
          Authorization: token || "",
          ...(dataToSend instanceof FormData ? dataToSend.getHeaders() : {}),
        },
      });

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

module.exports = { makeRequest, makeRequestForMultipleRoles };
