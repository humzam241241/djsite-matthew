import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const parsed = ContactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, message } = parsed.data;
    const to = process.env.CONTACT_TO_EMAIL || process.env.RESEND_TO || "";
    const from = process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM || "no-reply@example.com";

    const useResend = !!process.env.RESEND_API_KEY;
    const useSmtp = !!process.env.SMTP_HOST;

    if (useResend) {
      const Resend = (await import("resend")).Resend;
      const client = new Resend(process.env.RESEND_API_KEY!);
      await client.emails.send({
        to,
        from,
        subject: `Contact form — ${name}`,
        reply_to: email,
        text: message
      });
    } else if (useSmtp) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        } : undefined
      });
      await transporter.sendMail({
        to,
        from,
        subject: `Contact form — ${name}`,
        replyTo: email,
        text: message
      });
    } else {
      console.log("Contact (no mail provider configured):", { name, email, message });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}