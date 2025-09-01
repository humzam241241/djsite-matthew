import { NextResponse } from "next/server";
import { readPages, writePages } from "@/app/lib/content";
import { revalidatePath } from "next/cache";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const pages = await readPages();
  const page = pages.find(p => p.id === params.id);
  if (!page) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const { title } = body as { title?: string };
  if (!title || typeof title !== "string") {
    return new NextResponse("Invalid title", { status: 400 });
  }
  const pages = await readPages();
  const idx = pages.findIndex(p => p.id === params.id);
  if (idx === -1) return new NextResponse("Not found", { status: 404 });

  pages[idx] = { ...pages[idx], title };

  await writePages(pages);

  // Revalidate any paths that depend on pages (Navbar lives in layout)
  revalidatePath("/");      // home
  revalidatePath("/admin"); // admin dashboard

  return NextResponse.json(pages[idx]);
}
