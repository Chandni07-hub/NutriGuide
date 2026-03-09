const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/meals.json");

router.post("/generate-meal", (req, res) => {

    const { height, weight, age, gender, activity, goal, userId } = req.body;

    let calories = weight * 30;

    if (activity === "low") calories *= 1.2;
    if (activity === "moderate") calories *= 1.4;
    if (activity === "high") calories *= 1.6;

    if (goal === "Lose Weight") calories -= 500;
    if (goal === "Gain Weight") calories += 500;

    let mealPlan = {};

    if (goal === "Gain Weight") {
        mealPlan = {
            breakfast: "Oats + Banana + Peanut Butter",
            lunch: "Rice + Chicken + Vegetables",
            dinner: "Paneer + Roti"
        };
    }

    else if (goal === "Lose Weight") {
        mealPlan = {
            breakfast: "Boiled Eggs + Green Tea",
            lunch: "Grilled Chicken + Salad",
            dinner: "Vegetable Soup"
        };
    }

    else {
        mealPlan = {
            breakfast: "Oats + Fruits",
            lunch: "Rice + Dal + Vegetables",
            dinner: "Roti + Paneer"
        };
    }

    const newMeal = {
        id: Date.now(),
        userId: userId || 1,
        goal,
        calories: Math.round(calories),
        ...mealPlan
    };

    fs.readFile(filePath, "utf8", (err, data) => {

        let meals = [];

        try {
            meals = JSON.parse(data || "[]");
        } catch {
            meals = [];
        }

        meals.push(newMeal);

        fs.writeFile(filePath, JSON.stringify(meals, null, 2), (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Error saving meal"
                });
            }

            res.json(newMeal);

        });

    });

});

module.exports = router;