import QRCode from "qrcode";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * Generate a QR code for the site URL
 */
async function generateQRCode() {
  // Get the site URL from environment variable or use default
  const url = process.env.SITE_URL || "http://localhost:3000";
  
  // Output file path
  const out = path.join(process.cwd(), "public", "qr.png");
  
  try {
    // Generate QR code buffer
    const buffer = await QRCode.toBuffer(url, { 
      width: 512,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    // Write to file
    await writeFile(out, buffer);
    
    console.log(`✅ Generated QR code at ${out} for URL: ${url}`);
  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    process.exit(1);
  }
}

// Run the function
generateQRCode();
