"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  async function handleTestPermissions() {
    try {
      setIsUploading(true);
      const response = await fetch("/api/test-upload", {
        method: "POST"
      });
      
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({ error: error.message });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleUpload() {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setResult(null);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test File Upload</h1>
      
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
      </div>
      
      <div className="space-y-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">1. Test File System Permissions</h2>
          <button 
            onClick={handleTestPermissions}
            disabled={isUploading}
            className="btn mb-4"
          >
            {isUploading ? "Testing..." : "Test Permissions"}
          </button>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2">Test Result:</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">2. Test File Upload</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {file && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}
          
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`btn ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2">Upload Result:</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.success && result.file && result.file.url && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Uploaded Image:</h4>
                  <img 
                    src={result.file.url} 
                    alt="Uploaded file"
                    className="max-h-48 border rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

