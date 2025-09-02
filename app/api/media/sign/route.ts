import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";
  if (!cloudName || !apiKey || (!apiSecret && !uploadPreset)) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 400 });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  // When using unsigned preset, signature can be blank
  let signature = "";
  if (apiSecret) {
    const toSign = `timestamp=${timestamp}${uploadPreset ? `&upload_preset=${uploadPreset}` : ""}${apiSecret ? "" : ""}`;
    signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
  }
  return NextResponse.json({ signature, timestamp, cloudName, apiKey, uploadPreset });
}


