"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function QRCode() {
  const [siteUrl, setSiteUrl] = useState("");
  
  useEffect(() => {
    // Get the current site URL
    setSiteUrl(window.location.origin);
  }, []);
  
  return (
    <div className="flex flex-col items-center p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-2">Scan to visit our website</h3>
      <div className="relative w-48 h-48 border p-2 bg-white">
        <Image
          src="/qr.png"
          alt={`QR Code for ${siteUrl || 'our website'}`}
          fill
          sizes="192px"
          className="object-contain"
          priority
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">{siteUrl || 'soundvibe.ca'}</p>
    </div>
  );
}
