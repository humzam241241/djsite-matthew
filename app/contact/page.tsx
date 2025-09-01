"use client";

import { useState } from "react";
import contactContent from "../../content/contact.json";

export default function ContactPage() {
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
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json();
    setStatus(json.ok ? "Sent! Check your inbox." : json.error || "Failed to send");
    form.reset();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">{contactContent.title || "Contact Us"}</h1>
      {(contactContent.intro || contactContent.email || contactContent.phone || contactContent.address) && (
        <div className="mb-6 text-gray-700 space-y-2">
          {contactContent.intro && <p>{contactContent.intro}</p>}
          <div className="text-sm space-y-1">
            {contactContent.email && <div><span className="font-medium">Email:</span> {contactContent.email}</div>}
            {contactContent.phone && <div><span className="font-medium">Phone:</span> {contactContent.phone}</div>}
            {contactContent.address && <div><span className="font-medium">Address:</span> {contactContent.address}</div>}
          </div>
        </div>
      )}
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
