import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    console.log("Test upload endpoint called");
    
    // Create test directory
    const testDir = join(process.cwd(), "public", "test-uploads");
    await mkdir(testDir, { recursive: true });
    
    // Create a test file
    const testFilePath = join(testDir, "test-file.txt");
    await writeFile(testFilePath, "This is a test file to verify write permissions");
    
    // Return success
    return NextResponse.json({
      success: true,
      message: "Test file created successfully",
      path: testFilePath
    });
  } catch (error: any) {
    console.error("Test upload error:", error);
    return NextResponse.json({
      error: "Failed to create test file",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}




