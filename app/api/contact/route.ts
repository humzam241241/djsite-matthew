import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";

// Define contact form schema
const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(5000)
});

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT = 5; // Max requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimiter.entries()) {
    if (now - data.timestamp > RATE_WINDOW) {
      rateLimiter.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
              request.headers.get("x-real-ip") || 
              "unknown";
    
    // Check rate limit
    const now = Date.now();
    const rateData = rateLimiter.get(ip) || { count: 0, timestamp: now };
    
    // Reset count if outside the window
    if (now - rateData.timestamp > RATE_WINDOW) {
      rateData.count = 0;
      rateData.timestamp = now;
    }
    
    // Increment count and check limit
    rateData.count++;
    rateLimiter.set(ip, rateData);
    
    if (rateData.count > RATE_LIMIT) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
    
    // Parse and validate request data
    const parsed = ContactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    const { name, email, message } = parsed.data;
    
    // Get email configuration
    const to = process.env.CONTACT_TO_EMAIL || "";
    const from = process.env.CONTACT_FROM_EMAIL || "SoundVibe <no-reply@soundvibe.site>";
    
    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Send email with Resend
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from,
        to,
        subject: `Contact Form: ${name}`,
        reply_to: email,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      });
    } else {
      // Log to console in development
      console.log("Contact form submission (no email provider):", { name, email, message });
    }
    
    // Log to file
    try {
      const dataDir = path.join(process.cwd(), ".data");
      await mkdir(dataDir, { recursive: true });
      
      const logFile = path.join(dataDir, "contact.log");
      const timestamp = new Date().toISOString();
      const logEntry = `${timestamp} | ${name} | ${email} | ${message.replace(/\n/g, " ")}\n`;
      
      await appendFile(logFile, logEntry);
    } catch (logError) {
      console.error("Failed to log contact submission:", logError);
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}