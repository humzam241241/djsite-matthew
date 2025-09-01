import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper function to read content file
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contentType = searchParams.get("type");
  
  if (!contentType) {
    return NextResponse.json({ error: "Content type is required" }, { status: 400 });
  }
  
  const validTypes = ["services", "testimonials", "gallery", "about", "landing", "pages", "navigation"];
  if (!validTypes.includes(contentType)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }
  
  try {
    const filePath = path.join(process.cwd(), "content", `${contentType}.json`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    console.error("Error reading content file:", error);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

// Helper function to update content file
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contentType = searchParams.get("type");
  
  if (!contentType) {
    return NextResponse.json({ error: "Content type is required" }, { status: 400 });
  }
  
  const validTypes = ["services", "testimonials", "gallery", "about", "landing", "pages", "navigation"];
  if (!validTypes.includes(contentType)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }
  
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), "content", `${contentType}.json`);
    
    // Validate the structure based on content type
    if (contentType === "services" && !body.categories) {
      return NextResponse.json({ error: "Invalid services structure" }, { status: 400 });
    } else if (contentType === "testimonials" && !body.items) {
      return NextResponse.json({ error: "Invalid testimonials structure" }, { status: 400 });
    } else if (contentType === "gallery" && !body.items) {
      return NextResponse.json({ error: "Invalid gallery structure" }, { status: 400 });
    } else if (contentType === "about" && (!body.blurb || !body.referrals)) {
      return NextResponse.json({ error: "Invalid about structure" }, { status: 400 });
    } else if (contentType === "landing" && (!body.hero || !body.sections)) {
      return NextResponse.json({ error: "Invalid landing page structure" }, { status: 400 });
    } else if (contentType === "navigation" && !body.items) {
      return NextResponse.json({ error: "Invalid navigation structure" }, { status: 400 });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating content file:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}