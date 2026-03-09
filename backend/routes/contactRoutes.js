const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/messages.json");


// GET: show all messages
router.get("/", (req, res) => {

  fs.readFile(filePath, "utf8", (err, data) => {

    if (err) {
      return res.status(500).json({
        message: "Error reading messages"
      });
    }

    const messages = JSON.parse(data || "[]");

    res.json(messages);

  });

});


// POST: save contact message
router.post("/", (req, res) => {

  const newMessage = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {

    let messages = [];

    if (!err && data) {
      messages = JSON.parse(data);
    }

    messages.push({
      id: Date.now(),
      ...newMessage
    });

    fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {

      if (err) {
        return res.status(500).json({
          message: "Error saving message"
        });
      }

      res.json({
        message: "Message saved successfully"
      });

    });

  });

});

module.exports = router;