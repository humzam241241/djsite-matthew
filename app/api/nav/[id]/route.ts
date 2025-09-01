import { NextRequest, NextResponse } from "next/server";
import { updateNavItemTitle } from "@/app/lib/nav";
import { revalidatePath } from "next/cache";

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await req.json().catch(() => ({}));
  const title = body?.title as string;
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });
  try {
    const updated = await updateNavItemTitle(params.id, title);
    // Revalidate home (layout) and admin pages
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 500 });
  }
}


