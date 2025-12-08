const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const FILE = "./recipes.json";

// Helper function
function loadData() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// Get all recipes
app.get("/recipes", (req, res) => {
  const data = loadData();
  res.json(data.meals);
});

// Add a recipe
app.post("/recipes", (req, res) => {
  const data = loadData();

  const newRecipe = {
    idMeal: "n-" + Date.now(),
    ...req.body,
  };

  data.meals.push(newRecipe);
  saveData(data);

  res.json({ message: "Recipe added", recipe: newRecipe });
});

// Update recipe
app.put("/recipes/:idMeal", (req, res) => {
  const { idMeal } = req.params;
  const data = loadData();

  const index = data.meals.findIndex((r) => r.idMeal === idMeal);

  if (index === -1) return res.status(404).json({ message: "Not found" });

  data.meals[index] = { ...data.meals[index], ...req.body };

  saveData(data);

  res.json({ message: "Recipe updated" });
});

// Delete recipe
app.delete("/recipes/:idMeal", (req, res) => {
  const { idMeal } = req.params;
  const data = loadData();

  const filtered = data.meals.filter((r) => r.idMeal !== idMeal);

  data.meals = filtered;
  saveData(data);

  res.json({ message: "Recipe deleted" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
