import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60; // Set max duration for the API route to 60 seconds

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = formData.get("type") as string || "image";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log file information for debugging
    console.log("File upload attempt:", {
      name: file.name,
      type: file.type,
      size: file.size,
      requestedType: fileType
    });

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm"];
    
    let uploadDir = "uploads/images";
    if (fileType === "video") {
      uploadDir = "uploads/videos";
      if (!validVideoTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: "Invalid video format. Supported formats: MP4, WebM",
          fileType: file.type
        }, { status: 400 });
      }
    } else {
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: "Invalid image format. Supported formats: JPEG, PNG, GIF, WebP",
          fileType: file.type
        }, { status: 400 });
      }
    }
    
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 10MB",
        size: file.size
      }, { status: 400 });
    }
    
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const uniqueId = uuidv4().substring(0, 8);
      const fileExtension = file.name.split(".").pop() || "";
      const fileName = `${timestamp}-${uniqueId}.${fileExtension}`;
      
      // Create full path
      const publicDir = join(process.cwd(), "public");
      const uploadPath = join(publicDir, uploadDir);
      const filePath = join(uploadPath, fileName);
      const publicPath = `/${uploadDir}/${fileName}`;
      
      console.log("Saving file to:", filePath);
      
      // Ensure directory exists
      await mkdir(dirname(filePath), { recursive: true });
      
      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await writeFile(filePath, buffer);
      console.log("File saved successfully to", filePath);
      
      // Return success response
      return NextResponse.json({
        success: true,
        file: {
          url: publicPath,
          type: fileType,
          name: file.name,
        },
      });
    } catch (error: any) {
      console.error("File system error:", error);
      return NextResponse.json({ 
        error: "Failed to save file",
        details: error.message,
        stack: error.stack
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to process upload",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}