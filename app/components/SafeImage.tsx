"use client";

import { useState } from "react";
import Image from "next/image";

type SafeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = ""
}: SafeImageProps) {
  const [error, setError] = useState(false);
  
  // Show placeholder if image fails to load
  if (error) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}
        style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  // Render image with error handling
  return fill ? (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setError(true)}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width || 100}
      height={height || 100}
      className={className}
      onError={() => setError(true)}
    />
  );
}



