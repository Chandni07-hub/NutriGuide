import { useNavigate } from "react-router-dom";
import { ArrowRight, Utensils, HeartPulse, CalendarCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food.jpg";
import consultationImage from "@/assets/consultation.jpg";

const features = [
{ icon: Utensils, title: "Personalized Meals", desc: "Custom meal plans tailored to your dietary needs and preferences." },
{ icon: HeartPulse, title: "Health Tracking", desc: "Monitor your nutrition intake and track progress toward your goals." },
{ icon: CalendarCheck, title: "Meal Scheduling", desc: "Plan your weekly meals with our intelligent scheduling system." },
{ icon: Users, title: "Expert Consultation", desc: "Book sessions with certified nutritionists and dietitians." },
];

const Index = () => {

const navigate = useNavigate();

const handleDashboardAccess = () => {
const token = localStorage.getItem("token");

if (token) {
  navigate("/dashboard");
} else {
  navigate("/auth");
}

};

return (
<>
{/* Hero */} <section className="relative min-h-[90vh] flex items-center"> <img src={heroImage} alt="Healthy food bowl" className="absolute inset-0 w-full h-full object-cover" /> <div className="absolute inset-0 hero-gradient" />

```
    <div className="container relative z-10 py-20">
      <div className="max-w-2xl animate-fade-in">

        <span className="nutri-badge mb-6 bg-primary/20 text-primary-foreground">
          🌿 Healthy Living Starts Here
        </span>

        <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
          Your Personalized <span className="text-accent">Diet & Meal</span> Guide
        </h1>

        <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg font-body">
          Discover nutritious recipes, get expert consultations, and build healthy eating habits with NutriGuide.
        </p>

        <div className="flex flex-wrap gap-4">

          <Button size="lg" className="gap-2" onClick={() => navigate("/auth")}>
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/about")}
            className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20"
          >
            Learn More
          </Button>

        </div>

      </div>
    </div>
  </section>

  {/* Features */}
  <section className="py-20 bg-muted/50">
    <div className="container">
      <div className="text-center mb-14">

        <h2 className="section-heading mb-3">
          Why Choose <span>NutriGuide</span>
        </h2>

        <p className="text-muted-foreground max-w-lg mx-auto">
          We combine nutrition science with technology to help you eat better every day.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {features.map((f, i) => (
          <div key={i} className="nutri-card p-6 text-center group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>

            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <f.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>

            <h3 className="font-heading font-semibold text-lg mb-2">
              {f.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {f.desc}
            </p>

          </div>
        ))}

      </div>
    </div>
  </section>

  {/* Consultation CTA */}
  <section className="py-20">
    <div className="container">

      <div className="grid md:grid-cols-2 gap-12 items-center">

        <div>

          <h2 className="section-heading mb-4">
            Book a <span>Consultation</span> Session
          </h2>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            Our certified nutritionists are ready to help you create a personalized diet plan.
          </p>

          <Button size="lg" className="gap-2" onClick={handleDashboardAccess}>
            Book Now <ArrowRight className="h-4 w-4" />
          </Button>

        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img src={consultationImage} alt="Nutrition consultation" className="w-full h-80 object-cover" />
        </div>

      </div>

    </div>
  </section>
</>

);
};

export default Index;
