'use client';

import * as React from 'react';

type Props = {
  label: string;
  accept?: string; // e.g., "image/*" or "video/*"
  onUploaded: (publicUrl: string) => void;
  maxBytes?: number; // optional client-side soft cap
};

export default function Uploader({ label, accept, onUploaded, maxBytes }: Props) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [debugInfo, setDebugInfo] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePick = () => inputRef.current?.click();

  const uploadFile = async (file: File) => {
    setError(null);
    setDebugInfo(null);
    setProgress(0);
    
    if (maxBytes && file.size > maxBytes) {
      setError(`File too large. Selected ${(file.size/1_000_000).toFixed(1)}MB; limit ${(maxBytes/1_000_000).toFixed(0)}MB.`);
      return;
    }
    
    setBusy(true);
    
    try {
      // Create form data with file and type
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
      
      setDebugInfo(`Uploading ${file.name} (${file.type}, ${(file.size/1024).toFixed(1)}KB)`);
      setProgress(10);
      
      // Direct upload to our API route
      console.log('Uploading file directly...');
      const res = await fetch('/api/upload', { 
        method: 'POST',
        body: formData
      });
      
      setProgress(50);
      
      // Get the response as text first for debugging
      const responseText = await res.text();
      setDebugInfo(prev => `${prev}\nResponse status: ${res.status}\nResponse text: ${responseText}`);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      console.log('Upload response:', data);
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }
      
      if (!data.success || !data.file || !data.file.url) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from server');
      }
      
      setProgress(100);
      onUploaded(data.file.url);
      
    } catch (e: any) {
      console.error('Upload error:', e);
      setError(`Upload failed: ${e.message}`);
      setProgress(null);
    } finally {
      // Keep progress bar visible briefly if successful
      if (progress === 100) {
        setTimeout(() => {
          setBusy(false);
          setProgress(null);
        }, 1000);
      } else {
        setBusy(false);
        setProgress(null);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  };

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm font-medium">{label}</div>
      <div
        onClick={handlePick}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center text-sm opacity-90 hover:opacity-100"
      >
        Drag & drop file here, or click to choose
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </div>
      
      {busy && (
        <div className="space-y-1">
          <div className="text-xs">Uploading{progress ? ` (${progress}%)` : '…'}</div>
          {progress !== null && (
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-brand-primary h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-100">
          <div className="font-medium mb-1">Error:</div>
          <div>{error}</div>
          {debugInfo && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-700">Debug Info</summary>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap overflow-auto max-h-40">
                {debugInfo}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}