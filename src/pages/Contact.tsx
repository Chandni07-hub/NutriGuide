import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    toast.success(data.message || "Message sent successfully!");

    setForm({
      name: "",
      email: "",
      phone: "",
      message: ""
    });

  } catch (error) {
    toast.error("Failed to send message");
  }
};

  return (
    <div>
      <section className="bg-primary/10 py-20 text-center">
        <div className="container">
          <h1 className="section-heading mb-3">Contact <span>Us</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Get in touch with our team for any inquiries.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <Input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Textarea placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <Button type="submit" size="lg">Send Message</Button>
              </form>
            </div>
            <div className="md:col-span-2 space-y-8">
              {[
                { icon: MapPin, label: "Address", value: "333 Broome St, New York, NY 10002, USA" },
                { icon: Phone, label: "Phone", value: "+1 (234) 567-8900" },
                { icon: Mail, label: "Email", value: "info@nutriguide.com" },
              ].map((c) => (
                <div key={c.label} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1">{c.label}</h4>
                    <p className="text-sm text-muted-foreground">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
