const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();                      // app creates the express sever
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// middleware
const logger = require("./middleware/logger");
app.use(logger);

// routes
const mealRoutes = require("./routes/mealRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api", mealRoutes);          
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);


// simple endpoint
app.get("/", (req, res) => {
    res.send("NutriGuide Backend Running");
});

// error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// server start (must be last)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
