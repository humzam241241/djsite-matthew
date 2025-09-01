"use client";

import { useState, useRef } from "react";

type FileUploadProps = {
  onUploadComplete: (fileData: { url: string; type: string; name: string }) => void;
  fileType: "image" | "video";
  className?: string;
};

export default function FileUpload({ 
  onUploadComplete, 
  fileType = "image",
  className = "" 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const acceptedTypes = {
    image: "image/jpeg, image/png, image/gif, image/webp",
    video: "video/mp4, video/webm"
  };

  // Clean up interval on unmount
  const cleanupInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    cleanupInterval();

    // Log file information
    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      // Start progress simulation - slower and more realistic
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          // Slower progress that stops at 90%
          const increment = Math.random() * 5; // Smaller increments
          const newProgress = prev + increment;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      console.log("Starting upload...");
      
      // Upload file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      // Clean up interval
      cleanupInterval();
      
      console.log("Upload response status:", response.status);
      
      const responseData = await response.json();
      console.log("Upload response data:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || "Failed to upload file");
      }

      // Complete the progress bar
      setUploadProgress(100);
      console.log("Upload successful:", responseData.file);
      
      // Short delay before calling the completion handler
      setTimeout(() => {
        onUploadComplete(responseData.file);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
      setUploadProgress(0);
    } finally {
      cleanupInterval();
      // Keep isUploading true for a moment if successful to show 100%
      if (uploadProgress === 100) {
        setTimeout(() => setIsUploading(false), 500);
      } else {
        setIsUploading(false);
      }
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className={`
          px-4 py-2 rounded-lg border border-gray-300 
          ${isUploading ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-50 cursor-pointer"}
          transition-colors flex items-center justify-center
        `}>
          <input
            type="file"
            ref={fileInputRef}
            accept={acceptedTypes[fileType]}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {isUploading ? "Uploading..." : `Upload ${fileType}`}
        </label>
        
        {fileType === "image" && (
          <span className="text-xs text-gray-500">
            JPEG, PNG, GIF, WebP
          </span>
        )}
        
        {fileType === "video" && (
          <span className="text-xs text-gray-500">
            MP4, WebM
          </span>
        )}
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-brand-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
          Error: {error}
        </div>
      )}
    </div>
  );
}