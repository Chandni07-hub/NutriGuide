const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// simple endpoint
app.get("/", (req, res) => {
    res.send("NutriGuide Backend Running");
});

const mealRoutes = require("./routes/mealRoutes");

app.use("/api", mealRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const logger = require("./middleware/logger");

app.use(logger);

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);
