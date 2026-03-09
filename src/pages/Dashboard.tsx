import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, Dumbbell, TrendingUp, User, BookOpen, CalendarCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import DietModule from "@/components/dashboard/DietModule";
import FitnessModule from "@/components/dashboard/FitnessModule";
import ProgressModule from "@/components/dashboard/ProgressModule";
import ProfileModule from "@/components/dashboard/ProfileModule";
import BlogModule from "@/components/dashboard/BlogModule";
import ConsultationModule from "@/components/dashboard/ConsultationModule";

const tabs = [
  { value: "diet", label: "Diet", icon: Utensils },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
  { value: "progress", label: "Progress", icon: TrendingUp },
  { value: "consultations", label: "Consult", icon: CalendarCheck },
  { value: "blog", label: "Blog", icon: BookOpen },
  { value: "profile", label: "Profile", icon: User },
];

const Dashboard = () => {

  const navigate = useNavigate();

  // protect dashboard
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }

  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">

      {/* header */}
      <section className="bg-primary/10 py-8">
        <div className="container">
          <h1 className="section-heading mb-1">
            Your <span>Dashboard</span>
          </h1>

          <p className="text-muted-foreground text-sm">
            Track meals, workouts, and progress — all in one place.
          </p>
        </div>
      </section>

      {/* tabs */}
      <div className="container py-8">

        <Tabs defaultValue="diet" className="space-y-6">

          {/* tab buttons */}
          <TabsList className="h-auto flex-wrap gap-1 bg-card border border-border p-1.5 rounded-xl">

            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-3 py-2 text-xs"
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}

          </TabsList>

          {/* tab content */}

          <TabsContent value="diet">
            <DietModule />
          </TabsContent>

          <TabsContent value="fitness">
            <FitnessModule />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressModule />
          </TabsContent>

          <TabsContent value="consultations">
            <ConsultationModule />
          </TabsContent>

          <TabsContent value="blog">
            <BlogModule />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileModule />
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
};

export default Dashboard;