import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Helper function to save file
async function saveFile(file: File, uploadDir: string): Promise<string> {
  // Create a unique filename
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const fileExtension = path.extname(file.name || "").toLowerCase();
  const newFilename = `${timestamp}-${uniqueId}${fileExtension}`;
  
  // Create full path
  const uploadPath = path.join(process.cwd(), "public", uploadDir);
  const filePath = path.join(uploadPath, newFilename);
  
  // Ensure directory exists
  await fs.mkdir(uploadPath, { recursive: true });
  
  // Convert file to buffer and save
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  // Return the public URL path
  return `/${uploadDir}/${newFilename}`;
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = formData.get("type") as string || "image";
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    // Validate file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm"];
    
    let uploadDir = "uploads/images";
    if (fileType === "video") {
      uploadDir = "uploads/videos";
      if (!validVideoTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: "Invalid video format. Supported formats: MP4, WebM" 
        }, { status: 400 });
      }
    } else {
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: "Invalid image format. Supported formats: JPEG, PNG, GIF, WebP" 
        }, { status: 400 });
      }
    }
    
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 10MB" 
      }, { status: 400 });
    }
    
    // Save the file
    const filePath = await saveFile(file, uploadDir);
    
    // Return success response
    return NextResponse.json({
      success: true,
      file: {
        url: filePath,
        type: fileType,
        name: file.name,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}