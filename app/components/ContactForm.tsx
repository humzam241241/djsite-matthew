"use client";

import { useState } from "react";

type FormStatus = {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
};

type ValidationErrors = {
  name?: string[];
  email?: string[];
  message?: string[];
};

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Reset status and errors
    setStatus({ type: "loading" });
    setErrors({});
    
    const form = e.currentTarget;
    const formElements = form.elements as HTMLFormControlsCollection & {
      name: HTMLInputElement;
      email: HTMLInputElement;
      message: HTMLTextAreaElement;
    };
    
    const data = {
      name: formElements.name.value.trim(),
      email: formElements.email.value.trim(),
      message: formElements.message.value.trim()
    };
    
    // Client-side validation
    const newErrors: ValidationErrors = {};
    if (!data.name) newErrors.name = ["Name is required"];
    if (!data.email) newErrors.email = ["Email is required"];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }
    if (!data.message) newErrors.message = ["Message is required"];
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus({ type: "error", message: "Please fix the errors below." });
      return;
    }
    
    try {
      const res = await fetch("/api/contact", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      
      const json = await res.json();
      
      if (res.ok && json.ok) {
        setStatus({ 
          type: "success", 
          message: "Message sent! We'll get back to you soon." 
        });
        form.reset();
      } else if (res.status === 429) {
        setStatus({ 
          type: "error", 
          message: "Too many requests. Please try again later." 
        });
      } else if (res.status === 400 && json.error?.fieldErrors) {
        // Handle validation errors from the server
        setErrors(json.error.fieldErrors);
        setStatus({ 
          type: "error", 
          message: "Please fix the errors below." 
        });
      } else {
        setStatus({ 
          type: "error", 
          message: json.error || "Failed to send message. Please try again." 
        });
      }
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: "Network error. Please check your connection and try again." 
      });
    }
  }

  return (
    <div className="max-w-xl">
      {status.message && (
        <div 
          className={`p-4 mb-4 rounded-lg ${
            status.type === "success" 
              ? "bg-green-100 text-green-800" 
              : status.type === "error" 
                ? "bg-red-100 text-red-800" 
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {status.message}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input 
            id="name"
            name="name" 
            placeholder="John Doe" 
            className={`w-full border rounded-lg p-3 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`} 
            required 
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input 
            id="email"
            name="email" 
            type="email" 
            placeholder="you@example.com" 
            className={`w-full border rounded-lg p-3 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`} 
            required 
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea 
            id="message"
            name="message" 
            placeholder="Tell us about your event..." 
            className={`w-full border rounded-lg p-3 h-32 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`} 
            required 
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message[0]}</p>
          )}
        </div>
        
        <button 
          className={`px-6 py-3 rounded-lg font-medium ${
            status.type === "loading"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          type="submit"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}