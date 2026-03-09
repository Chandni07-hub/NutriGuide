import { useState } from "react";
import { Plus, Trash2, Flame, Beef, Wheat, Apple, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Meal {
  id: number;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

const DietModule = () => {

  const [profile, setProfile] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    activity: "moderate",
    goal: "Lose Weight",
  });

  const [meals, setMeals] = useState<Meal[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {

    if (!profile.height || !profile.weight || !profile.age) {
      toast.error("Please enter height, weight and age");
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/generate-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      const data = await res.json();

      const generatedMeals: Meal[] = [
        {
          id: Date.now(),
          name: data.breakfast,
          type: "breakfast",
          calories: data.calories / 3,
          protein: 30,
          carbs: 40,
          fat: 10,
          time: "8:00 AM"
        },
        {
          id: Date.now() + 1,
          name: data.lunch,
          type: "lunch",
          calories: data.calories / 3,
          protein: 30,
          carbs: 40,
          fat: 10,
          time: "1:00 PM"
        },
        {
          id: Date.now() + 2,
          name: data.dinner,
          type: "dinner",
          calories: data.calories / 3,
          protein: 30,
          carbs: 40,
          fat: 10,
          time: "7:00 PM"
        }
      ];

      setMeals(generatedMeals);
      setGenerated(true);

      toast.success("Meal plan generated!");

    } catch (err) {
      console.error(err);
      toast.error("Backend server not responding");
    }

  };

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const deleteMeal = (id: number) => {
    setMeals(meals.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">

      {/* Profile Form */}
      <div className="nutri-card p-6">

        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Generate Your Meal Plan</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

          <Input
            placeholder="Height"
            type="number"
            value={profile.height}
            onChange={(e) => setProfile({ ...profile, height: e.target.value })}
          />

          <Input
            placeholder="Weight"
            type="number"
            value={profile.weight}
            onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
          />

          <Input
            placeholder="Age"
            type="number"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />

          <Select
            value={profile.gender}
            onValueChange={(v) => setProfile({ ...profile, gender: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={profile.activity}
            onValueChange={(v) => setProfile({ ...profile, activity: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={profile.goal}
            onValueChange={(v) => setProfile({ ...profile, goal: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Lose Weight">Lose Weight</SelectItem>
              <SelectItem value="Gain Weight">Gain Weight</SelectItem>
              <SelectItem value="Maintain">Maintain</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <Button onClick={handleGenerate} className="mt-4 gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Meal Plan
        </Button>

      </div>

      {/* Nutrition Summary */}
      {generated && (

        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="nutri-card p-4">
              <div className="flex items-center gap-2">
                <Flame /> Calories
              </div>
              <div className="text-2xl font-bold">{totals.calories}</div>
            </div>

            <div className="nutri-card p-4">
              <div className="flex items-center gap-2">
                <Beef /> Protein
              </div>
              <div className="text-2xl font-bold">{totals.protein}g</div>
            </div>

            <div className="nutri-card p-4">
              <div className="flex items-center gap-2">
                <Wheat /> Carbs
              </div>
              <div className="text-2xl font-bold">{totals.carbs}g</div>
            </div>

            <div className="nutri-card p-4">
              <div className="flex items-center gap-2">
                <Apple /> Fat
              </div>
              <div className="text-2xl font-bold">{totals.fat}g</div>
            </div>

          </div>

          {/* Meal List */}
          <div className="space-y-3">

            {meals.map((meal) => (

              <div key={meal.id} className="nutri-card p-4 flex items-center justify-between">

                <div>
                  <div className="font-semibold">{meal.name}</div>
                  <div className="text-xs text-muted-foreground">{meal.time}</div>
                </div>

                <div className="flex gap-4 text-xs">
                  <span>{meal.calories} kcal</span>
                  <span>P: {meal.protein}</span>
                  <span>C: {meal.carbs}</span>
                  <span>F: {meal.fat}</span>
                </div>

                <Button variant="ghost" size="icon" onClick={() => deleteMeal(meal.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>

              </div>

            ))}

          </div>
        </>
      )}

    </div>
  );
};

export default DietModule;