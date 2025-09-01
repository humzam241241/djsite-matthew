import { NextResponse } from "next/server";
import { readPages } from "@/app/lib/content";

export async function GET() {
  const pages = await readPages();
  return NextResponse.json(pages);
}
