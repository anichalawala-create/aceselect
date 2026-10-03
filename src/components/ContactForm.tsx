"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const services = [
  "External Branding",
  "Internal Branding",
  "Re-Branding",
  "Brand Activation",
  "Customized Gifts",
  "Safety Solutions",
  "CSR Activities",
  "Retail Store Roll Outs",
  "Other / Multiple Services",
];

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    industry: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate form submission (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-neutral-50 p-12">
        <div className="text-solvorry-DEFAULT mb-6">
          <CheckCircle className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="font-display font-bold text-3xl text-solvorry-dark mb-4">
          Message Sent
        </h3>
        <p className="text-neutral-600 font-light text-lg mb-8 max-w-md">
          Thank you for reaching out. Our team will get back to you within 24 hours to start the conversation.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setStatus("idle");
            setFormState({ name: "", company: "", email: "", phone: "", city: "", industry: "", service: "", message: "" });
          }}
          className="border-solvorry-DEFAULT text-solvorry-DEFAULT hover:text-white"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  // Premium corporate styling: thin bottom border, large text, generous spacing
  const inputBase =
    "w-full bg-transparent border-b border-neutral-300 py-4 text-solvorry-dark font-body text-lg focus:outline-none focus:border-solvorry-DEFAULT transition-colors duration-300 rounded-none placeholder:text-neutral-400";

  const labelBase = "block text-[10px] font-display font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-body">
          <AlertCircle className="w-5 h-5 shrink-0" />
          Something went wrong. Please try again or email us directly at info@aceselect.in.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div>
          <label htmlFor="name" className={labelBase}>Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formState.name}
            onChange={handleChange}
            className={inputBase}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="company" className={labelBase}>Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formState.company}
            onChange={handleChange}
            className={inputBase}
            placeholder="Company Ltd."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div>
          <label htmlFor="email" className={labelBase}>Business Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formState.email}
            onChange={handleChange}
            className={inputBase}
            placeholder="john@company.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelBase}>Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formState.phone}
            onChange={handleChange}
            className={inputBase}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
        <div>
          <label htmlFor="city" className={labelBase}>City</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formState.city}
            onChange={handleChange}
            className={inputBase}
            placeholder="Mumbai"
          />
        </div>
        <div>
          <label htmlFor="industry" className={labelBase}>Industry</label>
          <input
            id="industry"
            name="industry"
            type="text"
            value={formState.industry}
            onChange={handleChange}
            className={inputBase}
            placeholder="Retail"
          />
        </div>
        <div>
          <label htmlFor="service" className={labelBase}>Project Type</label>
          <select
            id="service"
            name="service"
            value={formState.service}
            onChange={handleChange}
            className={`${inputBase} appearance-none cursor-pointer`}
          >
            <option value="" disabled className="text-neutral-400">Select...</option>
            {services.map((s) => (
              <option key={s} value={s} className="text-solvorry-dark">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelBase}>Project Details *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formState.message}
          onChange={handleChange}
          className={`${inputBase} resize-none`}
          placeholder="Tell us about your project requirements..."
        />
      </div>

      <div className="pt-6">
        <Button
          variant="primary"
          type="submit"
          disabled={status === "sending"}
          className={`w-full md:w-auto ${status === "sending" ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {status === "sending" ? "SUBMITTING..." : "START A CONVERSATION"}
        </Button>
      </div>
    </form>
  );
}
