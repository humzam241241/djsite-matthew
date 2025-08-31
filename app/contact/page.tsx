"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<null | string>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };
    setStatus("Sending...");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json();
    setStatus(json.ok ? "Sent! Check your inbox." : json.error || "Failed to send");
    form.reset();
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
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
