import { useState, useMemo } from "react";
import { Plus, Trash2, Apple, Beef, Wheat, Flame, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Meal {
  id: number;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

interface UserProfile {
  height: string;
  weight: string;
  age: string;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "weight_loss" | "maintenance" | "muscle_gain";
}

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const goalAdjustments: Record<string, number> = {
  weight_loss: -500,
  maintenance: 0,
  muscle_gain: 300,
};

const mealTemplates: Record<string, { name: string; type: Meal["type"]; time: string; calPct: number; pPct: number; cPct: number; fPct: number }[]> = {
  weight_loss: [
    { name: "Oatmeal with Berries & Almonds", type: "breakfast", time: "8:00 AM", calPct: 0.25, pPct: 0.2, cPct: 0.35, fPct: 0.2 },
    { name: "Greek Yogurt with Chia Seeds", type: "snack", time: "10:30 AM", calPct: 0.1, pPct: 0.15, cPct: 0.08, fPct: 0.08 },
    { name: "Grilled Chicken Salad with Quinoa", type: "lunch", time: "1:00 PM", calPct: 0.3, pPct: 0.35, cPct: 0.25, fPct: 0.3 },
    { name: "Apple with Peanut Butter", type: "snack", time: "4:00 PM", calPct: 0.1, pPct: 0.05, cPct: 0.12, fPct: 0.12 },
    { name: "Baked Salmon with Steamed Veggies", type: "dinner", time: "7:00 PM", calPct: 0.25, pPct: 0.25, cPct: 0.2, fPct: 0.3 },
  ],
  maintenance: [
    { name: "Eggs with Whole Wheat Toast & Avocado", type: "breakfast", time: "8:00 AM", calPct: 0.25, pPct: 0.22, cPct: 0.25, fPct: 0.3 },
    { name: "Trail Mix & Banana", type: "snack", time: "10:30 AM", calPct: 0.1, pPct: 0.08, cPct: 0.12, fPct: 0.1 },
    { name: "Turkey Wrap with Sweet Potato Fries", type: "lunch", time: "1:00 PM", calPct: 0.3, pPct: 0.3, cPct: 0.3, fPct: 0.25 },
    { name: "Cottage Cheese with Fruit", type: "snack", time: "4:00 PM", calPct: 0.1, pPct: 0.15, cPct: 0.1, fPct: 0.05 },
    { name: "Grilled Steak with Brown Rice & Broccoli", type: "dinner", time: "7:00 PM", calPct: 0.25, pPct: 0.25, cPct: 0.23, fPct: 0.3 },
  ],
  muscle_gain: [
    { name: "Protein Pancakes with Banana & Honey", type: "breakfast", time: "7:30 AM", calPct: 0.22, pPct: 0.2, cPct: 0.28, fPct: 0.15 },
    { name: "Protein Shake with Oats", type: "snack", time: "10:00 AM", calPct: 0.12, pPct: 0.18, cPct: 0.12, fPct: 0.05 },
    { name: "Chicken Breast with Pasta & Marinara", type: "lunch", time: "12:30 PM", calPct: 0.28, pPct: 0.28, cPct: 0.3, fPct: 0.2 },
    { name: "Rice Cakes with Tuna & Avocado", type: "snack", time: "3:30 PM", calPct: 0.12, pPct: 0.12, cPct: 0.1, fPct: 0.15 },
    { name: "Salmon with Sweet Potato & Asparagus", type: "dinner", time: "7:00 PM", calPct: 0.26, pPct: 0.22, cPct: 0.2, fPct: 0.45 },
  ],
};

const typeIcons: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

const DietModule = () => {
  const [profile, setProfile] = useState<UserProfile>({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    activityLevel: "moderate",
    goal: "weight_loss",
  });
  const [generated, setGenerated] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "breakfast" as Meal["type"], calories: "", protein: "", carbs: "", fat: "", time: "" });

  const nutritionGoals = useMemo(() => {
    const h = Number(profile.height);
    const w = Number(profile.weight);
    const a = Number(profile.age);
    if (!h || !w || !a) return null;

    // Mifflin-St Jeor BMR
    const bmr = profile.gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * activityMultipliers[profile.activityLevel];
    const targetCalories = Math.round(tdee + goalAdjustments[profile.goal]);

    // Macro split based on goal
    let proteinPct: number, carbsPct: number, fatPct: number;
    if (profile.goal === "weight_loss") {
      proteinPct = 0.35; carbsPct = 0.35; fatPct = 0.30;
    } else if (profile.goal === "muscle_gain") {
      proteinPct = 0.30; carbsPct = 0.45; fatPct = 0.25;
    } else {
      proteinPct = 0.25; carbsPct = 0.45; fatPct = 0.30;
    }

    return {
      calories: targetCalories,
      protein: Math.round((targetCalories * proteinPct) / 4),
      carbs: Math.round((targetCalories * carbsPct) / 4),
      fat: Math.round((targetCalories * fatPct) / 9),
    };
  }, [profile]);

  const handleGenerate = async () => {

  if (!profile.height || !profile.weight || !profile.age) {
    toast.error("Please enter your height, weight, and age.");
    return;
  }

  try {

    const response = await fetch("http://localhost:5000/api/meals");

    const data = await response.json();

    const backendMeals = data.map((m: any) => ({
      id: Date.now() + Math.random(),
      name: m.breakfast || m.name,
      type: "breakfast",
      time: "8:00 AM",
      calories: m.calories || 400,
      protein: 20,
      carbs: 40,
      fat: 10
    }));

    setMeals(backendMeals);
    setGenerated(true);

    toast.success("Meal plan generated from backend!");

  } catch (error) {
    console.error(error);
    toast.error("Backend server not responding");
  }
};

  const totals = meals.reduce(
    (acc, m) => ({ calories: acc.calories + m.calories, protein: acc.protein + m.protein, carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dailyGoal = nutritionGoals ?? { calories: 2200, protein: 130, carbs: 280, fat: 70 };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.time.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const cal = Number(form.calories);
    const pro = Number(form.protein);
    const car = Number(form.carbs);
    const fa = Number(form.fat);
    if (isNaN(cal) || isNaN(pro) || isNaN(car) || isNaN(fa) || cal < 0 || pro < 0 || car < 0 || fa < 0) {
      toast.error("Nutrition values must be valid positive numbers.");
      return;
    }
    const newMeal: Meal = {
      id: Date.now(),
      name: form.name.trim(),
      type: form.type,
      calories: cal,
      protein: pro,
      carbs: car,
      fat: fa,
      time: form.time.trim(),
    };
    setMeals([...meals, newMeal]);
    setForm({ name: "", type: "breakfast", calories: "", protein: "", carbs: "", fat: "", time: "" });
    setShowForm(false);
    toast.success("Meal logged successfully!");
  };

  const handleDelete = (id: number) => {
    setMeals(meals.filter((m) => m.id !== id));
    toast.info("Meal removed");
  };

  return (
    <div className="space-y-6">
      {/* Profile Input Card */}
      <div className="nutri-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Generate Your Meal Plan</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Enter your details below and we'll calculate your daily calorie needs and generate a personalized meal plan.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
            <Input
              type="number"
              placeholder="170"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: e.target.value })}
              min={100}
              max={250}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
            <Input
              type="number"
              placeholder="70"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
              min={30}
              max={300}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Age</label>
            <Input
              type="number"
              placeholder="25"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              min={10}
              max={120}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
            <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v as UserProfile["gender"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Activity</label>
            <Select value={profile.activityLevel} onValueChange={(v) => setProfile({ ...profile, activityLevel: v as UserProfile["activityLevel"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="very_active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Goal</label>
            <Select value={profile.goal} onValueChange={(v) => setProfile({ ...profile, goal: v as UserProfile["goal"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Lose Weight</SelectItem>
                <SelectItem value="maintenance">Maintain</SelectItem>
                <SelectItem value="muscle_gain">Gain Muscle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerate} className="mt-4 gap-2">
          <Sparkles className="h-4 w-4" /> Generate Meal Plan
        </Button>

        {nutritionGoals && profile.height && profile.weight && profile.age && (
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
            <span className="font-semibold text-primary">Estimated Daily Target:</span>{" "}
            <span className="text-foreground">{nutritionGoals.calories} kcal</span>
            <span className="text-muted-foreground"> · Protein: {nutritionGoals.protein}g · Carbs: {nutritionGoals.carbs}g · Fat: {nutritionGoals.fat}g</span>
          </div>
        )}
      </div>

      {/* Daily Nutrition Summary */}
      {generated && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Flame, label: "Calories", value: totals.calories, goal: dailyGoal.calories, unit: "kcal", color: "text-accent" },
              { icon: Beef, label: "Protein", value: totals.protein, goal: dailyGoal.protein, unit: "g", color: "text-primary" },
              { icon: Wheat, label: "Carbs", value: totals.carbs, goal: dailyGoal.carbs, unit: "g", color: "text-accent" },
              { icon: Apple, label: "Fat", value: totals.fat, goal: dailyGoal.fat, unit: "g", color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="nutri-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
                <div className="text-2xl font-heading font-bold">{s.value}<span className="text-sm font-normal text-muted-foreground"> / {s.goal}{s.unit}</span></div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((s.value / s.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Log Meal */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-bold">Your Meal Plan</h3>
            <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Meal
            </Button>
          </div>

          {showForm && (
            <div className="nutri-card p-5">
              <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input placeholder="Meal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="col-span-2" maxLength={100} />
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Meal["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required maxLength={20} />
                <Input type="number" placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} required min={0} max={5000} />
                <Input type="number" placeholder="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} required min={0} max={500} />
                <Input type="number" placeholder="Carbs (g)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} required min={0} max={500} />
                <Input type="number" placeholder="Fat (g)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} required min={0} max={500} />
                <div className="col-span-2 md:col-span-4 flex gap-3">
                  <Button type="submit">Add Meal</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          {/* Meal List */}
          <div className="space-y-3">
            {(["breakfast", "snack", "lunch", "dinner"] as const).map((type) => {
              const typeMeals = meals.filter((m) => m.type === type);
              if (!typeMeals.length) return null;
              return (
                <div key={type}>
                  <div className="text-sm font-medium text-muted-foreground capitalize mb-2 flex items-center gap-2">
                    <span>{typeIcons[type]}</span> {type}
                  </div>
                  {typeMeals.map((meal) => (
                    <div key={meal.id} className="nutri-card p-4 mb-2 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="font-heading font-semibold">{meal.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{meal.time}</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{meal.calories} kcal</span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(meal.id)} className="shrink-0 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DietModule;
