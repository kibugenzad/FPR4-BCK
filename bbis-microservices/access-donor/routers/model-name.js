/*
model names
*/

const express = require("express");
const mongoose = require("mongoose"); // Import mongoose
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const modelNames = mongoose.modelNames(); // Get array of model names
    res.status(200).json(modelNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
