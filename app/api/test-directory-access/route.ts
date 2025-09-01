// app/api/test-directory-access/route.ts
import { NextResponse } from 'next/server';
import { access, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

export const runtime = 'nodejs';

export async function GET() {
  const results: Record<string, any> = {};
  
  try {
    // Check current working directory
    const cwd = process.cwd();
    results.cwd = cwd;
    
    // Check if public directory exists
    const publicDir = join(cwd, 'public');
    try {
      await access(publicDir, constants.R_OK | constants.W_OK);
      results.publicDirExists = true;
      results.publicDirPath = publicDir;
    } catch (error) {
      results.publicDirExists = false;
      results.publicDirError = (error as Error).message;
    }
    
    // Check uploads directories
    const imageUploadsDir = join(publicDir, 'uploads', 'images');
    const videoUploadsDir = join(publicDir, 'uploads', 'videos');
    
    // Check image uploads directory
    try {
      await access(imageUploadsDir, constants.R_OK | constants.W_OK);
      results.imageUploadsDirExists = true;
    } catch (error) {
      results.imageUploadsDirExists = false;
      
      // Try to create the directory
      try {
        await mkdir(imageUploadsDir, { recursive: true });
        results.imageUploadsDirCreated = true;
      } catch (mkdirError) {
        results.imageUploadsDirCreated = false;
        results.imageUploadsDirError = (mkdirError as Error).message;
      }
    }
    
    // Check video uploads directory
    try {
      await access(videoUploadsDir, constants.R_OK | constants.W_OK);
      results.videoUploadsDirExists = true;
    } catch (error) {
      results.videoUploadsDirExists = false;
      
      // Try to create the directory
      try {
        await mkdir(videoUploadsDir, { recursive: true });
        results.videoUploadsDirCreated = true;
      } catch (mkdirError) {
        results.videoUploadsDirCreated = false;
        results.videoUploadsDirError = (mkdirError as Error).message;
      }
    }
    
    // Try to write a test file
    try {
      const testFilePath = join(publicDir, 'uploads', 'test.txt');
      await writeFile(testFilePath, 'This is a test file to check write permissions.');
      results.writeTestSuccess = true;
      results.writeTestPath = testFilePath;
    } catch (writeError) {
      results.writeTestSuccess = false;
      results.writeTestError = (writeError as Error).message;
    }
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}
