"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next/themes";
import { useState } from "react";

interface LogoProps {
  variant?: "black" | "white" | "transparent";
  height?: number;
  width?: number;
  href?: string;
  showText?: boolean;
}

export default function Logo({
  variant,
  height = 40,
  width = 160,
  href = "/",
  showText = true
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  // Default to black logo
  const logoVariant = variant || "black";
  
  const logoSrc = `/branding/logo_${logoVariant}.png`;
  
  const content = (
    <div className="flex items-center">
      {!imageError ? (
        <div className="relative" style={{ height, width }}>
          <Image
            src={logoSrc}
            alt="Sound Vibe Logo"
            fill
            sizes={`${width}px`}
            className="object-contain"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="font-display text-xl font-bold">Sound Vibe</div>
      )}
      
      {/* Always show text if showText is true */}
      {showText && (
        <span className="ml-2 font-display text-xl font-bold">Sound Vibe</span>
      )}
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}