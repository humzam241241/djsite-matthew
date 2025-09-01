'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      addLog(`Selected file: ${selectedFile.name} (${selectedFile.type}, ${selectedFile.size} bytes)`);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      addLog('No file selected');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);
    addLog(`Starting upload of ${file.name}...`);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
      
      addLog('FormData created, sending to /api/upload...');
      
      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      addLog(`Response received: ${response.status} ${response.statusText}`);
      
      // Get response as text first for debugging
      const responseText = await response.text();
      addLog(`Response body: ${responseText}`);
      
      // Try to parse JSON
      try {
        const data = JSON.parse(responseText);
        setResult(data);
        
        if (response.ok && data.success && data.file?.url) {
          addLog(`Upload successful! URL: ${data.file.url}`);
        } else {
          setError(data.error || 'Unknown error');
          addLog(`Upload failed: ${data.error || 'Unknown error'}`);
        }
      } catch (parseError) {
        setError(`Failed to parse response as JSON: ${responseText}`);
        addLog(`JSON parse error: ${parseError}`);
      }
    } catch (e: any) {
      setError(e.message || 'Upload failed');
      addLog(`Error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const testDirectoryAccess = async () => {
    addLog('Testing directory access...');
    try {
      const response = await fetch('/api/test-directory-access');
      const data = await response.json();
      addLog(`Directory access test result: ${JSON.stringify(data)}`);
    } catch (e: any) {
      addLog(`Directory access test error: ${e.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upload Test Page</h1>
      
      <div className="card p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">File Upload Test</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Select a file:</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              className="border p-2 w-full rounded"
            />
          </div>
          
          {file && (
            <div className="text-sm">
              <p><strong>Name:</strong> {file.name}</p>
              <p><strong>Type:</strong> {file.type}</p>
              <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={uploadFile}
              disabled={!file || uploading}
              className={`px-4 py-2 rounded ${!file || uploading ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            
            <button
              onClick={testDirectoryAccess}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Test Directory Access
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded">
          <h3 className="font-semibold">Result:</h3>
          <pre className="text-xs overflow-auto max-h-40 bg-white p-2 mt-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <h3 className="bg-gray-100 p-3 font-semibold border-b">Debug Logs</h3>
        <div className="bg-black text-green-400 p-4 font-mono text-xs overflow-auto max-h-80">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">No logs yet</div>}
        </div>
      </div>
    </div>
  );
}