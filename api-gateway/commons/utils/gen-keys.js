const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const generateKeys = () => {
  // Define the paths for the keys
  const privateKeyPath = path.join(__dirname, "../.keys", "private_key.pem");
  const publicKeyPath = path.join(__dirname, "../.keys", "public_key.pem");

  // Check if keys already exist
  if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
    console.log("Keys already exist. Skipping generation.");
    return;
  }

  console.log("Generating public/private key pair...");

  // Generate the keys
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "",
    },
  });

  // Save the keys to files
  fs.writeFileSync(privateKeyPath, privateKey);
  fs.writeFileSync(publicKeyPath, publicKey);

  console.log("Keys generated and saved.");
};

module.exports = {
  generateKeys,
};
