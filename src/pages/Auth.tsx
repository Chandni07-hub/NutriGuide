import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Auth = () => {
const [isSignUp, setIsSignUp] = useState(false);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

try {

  // SIGNUP
  if (isSignUp) {

    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Signup failed");
      return;
    }

    toast.success("Account created successfully! Please login.");
    setIsSignUp(false);

    return;
  }

  // LOGIN
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(data.message || "Invalid email or password");
    return;
  }

  // Save token
  localStorage.setItem("token", data.token);

  toast.success("Login successful!");

  navigate("/dashboard");

} catch (error) {
  console.error(error);
  toast.error("Something went wrong");
}

};

return ( <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
  <div className="w-full max-w-md mx-4">

    <div className="nutri-card p-8">

      <div className="text-center mb-8">

        <div className="flex justify-center mb-3">
          <Leaf className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-2xl font-heading font-bold">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          {isSignUp
            ? "Start your nutrition journey"
            : "Sign in to your NutriGuide account"}
        </p>

      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {isSignUp && (
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" size="lg">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {isSignUp
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary font-medium hover:underline"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>

    </div>

  </div>

</div>


);
};

export default Auth;
