// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir, access } from "fs/promises";
import { join, dirname, extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { constants } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Use Node.js runtime for file system operations
export const runtime = 'nodejs';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

// Check if Vercel Blob is configured
const isVercelBlobConfigured = process.env.BLOB_READ_WRITE_TOKEN && 
                               process.env.BLOB_READ_WRITE_TOKEN !== "vercel-blob-rw-token-goes-here-for-local-dev";

// Maximum video size in MB (from env or default to 100MB)
const MAX_VIDEO_SIZE_MB = parseInt(process.env.MAX_VIDEO_MB || '100', 10);
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export async function POST(request: Request) {
  try {
    console.log("Upload API called with content-type:", request.headers.get('content-type'));
    
    // Check if we're receiving a file upload
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      try {
        const formData = await request.formData();
        console.log("FormData keys:", Array.from(formData.keys()));
        
        const file = formData.get('file');
        if (!file || !(file instanceof Blob)) {
          console.error("No file in request or file is not a Blob");
          return NextResponse.json({ 
            success: false, 
            error: 'No file provided or invalid file format' 
          }, { status: 400 });
        }
        
        const fileType = formData.get('type') as string || 
                        (file.type.startsWith('image/') ? 'image' : 
                         file.type.startsWith('video/') ? 'video' : 'image');
        
        // Get file name if available
        const fileName = 'name' in file ? file.name : `upload-${Date.now()}`;
        
        console.log("File upload attempt:", {
          name: fileName,
          type: file.type,
          size: file.size,
          requestedType: fileType
        });
        
        // Check file size for videos
        if (fileType === 'video' && file.size > MAX_VIDEO_SIZE_BYTES) {
          return NextResponse.json({
            success: false,
            error: `Video exceeds maximum size of ${MAX_VIDEO_SIZE_MB}MB`
          }, { status: 400 });
        }

        // Try to use Cloudinary if configured
        if (isCloudinaryConfigured) {
          try {
            // Convert file to buffer for Cloudinary upload
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            // Create a unique filename
            const timestamp = Date.now();
            const uniqueId = uuidv4().substring(0, 8);
            const cloudinaryFileName = `${timestamp}-${uniqueId}${extname(fileName)}`;
            
            // Prepare upload folder path
            const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'soundvibe';
            const folderPath = fileType === 'video' ? `${uploadFolder}/videos` : `${uploadFolder}/images`;
            
            // Upload to Cloudinary
            const uploadPromise = new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: folderPath,
                  public_id: cloudinaryFileName.replace(/\.[^/.]+$/, ""), // Remove extension for public_id
                  resource_type: fileType === 'video' ? 'video' : 'image'
                },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
              
              uploadStream.end(buffer);
            });
            
            const result = await uploadPromise as any;
            
            console.log("File uploaded to Cloudinary:", result.secure_url);
            return NextResponse.json({
              success: true,
              file: {
                url: result.secure_url,
                type: fileType,
                name: fileName,
                public_id: result.public_id,
                width: result.width,
                height: result.height
              },
            });
          } catch (cloudinaryError: any) {
            console.error("Cloudinary upload failed, falling back to alternatives:", cloudinaryError);
            // Fall back to other upload methods
          }
        }
        
        // Try to use Vercel Blob if configured
        if (isVercelBlobConfigured) {
          try {
            const { put } = await import('@vercel/blob');
            
            // Upload to Vercel Blob
            const blobName = `upload-${Date.now()}-${uuidv4().substring(0, 8)}${extname(fileName)}`;
            const blob = await put(blobName, file, {
              access: 'public',
            });
            
            console.log("File uploaded to Vercel Blob:", blob.url);
            return NextResponse.json({
              success: true,
              file: {
                url: blob.url,
                type: fileType,
                name: fileName,
              },
            });
          } catch (blobError: any) {
            console.error("Vercel Blob upload failed, falling back to filesystem:", blobError);
            // Fall back to file system upload
          }
        }
        
        // Fall back to file system upload if other methods are not configured or failed
        return await handleFileSystemUpload(file, fileType, fileName);
      } catch (formError: any) {
        console.error("Error processing form data:", formError);
        return NextResponse.json({ 
          success: false,
          error: `Error processing form data: ${formError.message}`,
          stack: formError.stack
        }, { status: 400 });
      }
    } else {
      // For API-only requests, return a simple success response
      return NextResponse.json({
        success: true,
        message: "Upload endpoint is ready. Send a multipart/form-data request with a file to upload."
      });
    }
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ 
      success: false,
      error: `Upload failed: ${error.message || 'Unknown error'}`,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Original file system upload implementation
async function handleFileSystemUpload(file: Blob, fileType: string, originalFileName: string) {
  try {
    // Validate file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm"];
    
    let uploadDir = "uploads/images";
    if (fileType === "video") {
      uploadDir = "uploads/videos";
      if (!validVideoTypes.includes(file.type)) {
        return NextResponse.json({ 
          success: false,
          error: `Invalid video format: ${file.type}. Supported formats: MP4, WebM`,
          fileType: file.type
        }, { status: 400 });
      }
    } else {
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json({ 
          success: false,
          error: `Invalid image format: ${file.type}. Supported formats: JPEG, PNG, GIF, WebP`,
          fileType: file.type
        }, { status: 400 });
      }
    }
    
    // Get file extension from original filename or mime type
    let fileExtension = extname(originalFileName);
    if (!fileExtension) {
      // Fallback to mime type
      fileExtension = `.${file.type.split("/")[1] || "bin"}`;
    }
    
    // Create a unique filename
    const timestamp = Date.now();
    const uniqueId = uuidv4().substring(0, 8);
    const fileName = `${timestamp}-${uniqueId}${fileExtension}`;
    
    // Create full path
    const publicDir = join(process.cwd(), "public");
    const uploadPath = join(publicDir, uploadDir);
    const filePath = join(uploadPath, fileName);
    const publicPath = `/${uploadDir}/${fileName}`;
    
    console.log("Saving file to:", filePath);
    
    // Ensure public directory exists
    try {
      await access(publicDir, constants.R_OK | constants.W_OK);
    } catch (error) {
      console.error("Public directory doesn't exist or isn't writable:", error);
      return NextResponse.json({
        success: false,
        error: "Server storage error: public directory not accessible",
        details: (error as Error).message
      }, { status: 500 });
    }
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadPath, { recursive: true });
      console.log("Upload directory created or confirmed:", uploadPath);
    } catch (mkdirError) {
      console.error("Failed to create upload directory:", mkdirError);
      return NextResponse.json({
        success: false,
        error: "Server storage error: couldn't create upload directory",
        details: (mkdirError as Error).message
      }, { status: 500 });
    }
    
    try {
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
          name: originalFileName,
        },
      });
    } catch (writeError) {
      console.error("Failed to write file:", writeError);
      return NextResponse.json({
        success: false,
        error: "Server storage error: couldn't write file",
        details: (writeError as Error).message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("File system error:", error);
    return NextResponse.json({ 
      success: false,
      error: `Failed to save file: ${error.message}`,
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}