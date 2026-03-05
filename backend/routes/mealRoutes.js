const express = require("express");
const fs = require("fs");
const router = express.Router();

// endpoint to generate meal plan
router.get("/generate-meal", (req, res) => {

    const { height, weight, age, gender, activity, goal } = req.body;

    let calories = weight * 30;

    if (goal === "Lose Weight") {
        calories -= 500;
    }

    if (goal === "Gain Weight") {
        calories += 500;
    }

    const mealPlan = {
        calories: calories,
        breakfast: "Oats and Fruits",
        lunch: "Brown rice with vegetables",
        dinner: "Grilled paneer with salad"
    };

    res.json(mealPlan);
});

router.get("/meals", (req, res) => {

    fs.readFile("./data/meals.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading file");
        }

        res.json(JSON.parse(data));
    });

});

module.exports = router;