import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    
    // Validate the data
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // In a real application, you would send an email here
    // For example, using a service like SendGrid, Mailgun, etc.
    console.log("Contact form submission:", { name, email, message });
    
    // For demo purposes, we'll just return a success response
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}