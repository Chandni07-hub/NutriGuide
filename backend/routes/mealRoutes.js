const express = require("express");
const fs = require("fs");
const router = express.Router();

// generate meal according to user data
router.post("/generate-meal", (req, res) => {

    const { height, weight, age, gender, activity, goal } = req.body;

    let calories = weight * 30;

    // activity multiplier
    if (activity === "low") calories *= 1.2;
    if (activity === "moderate") calories *= 1.4;
    if (activity === "high") calories *= 1.6;

    // goal adjustment
    if (goal === "Lose Weight") {
        calories -= 500;
    }

    if (goal === "Gain Weight") {
        calories += 500;
    }

    let mealPlan = {};

    if (goal === "Gain Weight") {

        mealPlan = {
            calories: Math.round(calories),
            breakfast: "Oats + Banana + Peanut Butter",
            lunch: "Rice + Chicken + Vegetables",
            dinner: "Paneer + Roti"
        };

    }

    else if (goal === "Lose Weight") {

        mealPlan = {
            calories: Math.round(calories),
            breakfast: "Boiled Eggs + Green Tea",
            lunch: "Grilled Chicken + Salad",
            dinner: "Vegetable Soup"
        };

    }

    else {

        mealPlan = {
            calories: Math.round(calories),
            breakfast: "Oats + Fruits",
            lunch: "Rice + Dal + Vegetables",
            dinner: "Roti + Paneer"
        };

    }

    res.json(mealPlan);
});


// get all meals from JSON
router.get("/meals", (req, res) => {

    fs.readFile("./data/meals.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading meals file"
            });
        }

        res.json(JSON.parse(data));
    });

});

// get meal by id (Route Parameter)
router.get("/meals/:id", (req, res) => {

    const mealId = req.params.id;

    fs.readFile("./data/meals.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading meals file"
            });
        }

        const meals = JSON.parse(data);

        const meal = meals.find(m => m.id == mealId);

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found"
            });
        }

        res.json(meal);

    });

});

module.exports = router;