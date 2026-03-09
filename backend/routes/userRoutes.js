const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/users.json");

// GET all users
router.get("/", (req, res) => {

  fs.readFile(filePath, "utf8", (err, data) => {

    if (err) {
      return res.status(500).json({
        message: "Error reading users file"
      });
    }

    const users = JSON.parse(data);

    res.json(users);

  });

});

module.exports = router;