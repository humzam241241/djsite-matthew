import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.parse(body);

    // In real deployment: send via Resend/SendGrid/SES using env vars.
    // Here, we log to console to prove functionality without secrets.
    console.log("CONTACT_SUBMISSION", parsed);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "Invalid payload" }, { status: 400 });
  }
}
