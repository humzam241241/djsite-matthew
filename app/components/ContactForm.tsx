"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<null | string>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as HTMLFormControlsCollection & {
      name: HTMLInputElement;
      email: HTMLInputElement;
      message: HTMLTextAreaElement;
    };
    const data = {
      name: formElements.name.value,
      email: formElements.email.value,
      message: formElements.message.value
    };
    
    setStatus("Sending...");
    
    try {
      const res = await fetch("/api/contact", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      
      const json = await res.json();
      setStatus(json.ok ? "Sent! Check your inbox." : json.error || "Failed to send");
      form.reset();
    } catch (error) {
      setStatus("Failed to send. Please try again later.");
    }
  }

  return (
    <div className="max-w-xl">
      <form className="space-y-4" onSubmit={onSubmit}>
        <input name="name" placeholder="Your name" className="w-full border rounded-lg p-3" required />
        <input name="email" type="email" placeholder="you@example.com" className="w-full border rounded-lg p-3" required />
        <textarea name="message" placeholder="Tell us about your event..." className="w-full border rounded-lg p-3 h-32" required />
        <button className="btn" type="submit">Send</button>
      </form>
      {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
    </div>
  );
}

