import { NextRequest, NextResponse } from "next/server";

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 12 // 12 hours
  };
}

export async function GET(req: NextRequest) {
  const authenticated = req.cookies.get("admin")?.value === "1";
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));

    // Logout path
    if (body?.logout) {
      const res = NextResponse.json({ ok: true, authenticated: false });
      res.cookies.set("admin", "", { ...getCookieOptions(), maxAge: 0 });
      return res;
    }

    const password = String(body?.password ?? "");
    const configured = process.env.ADMIN_PASSWORD ?? "";

    if (!configured) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD not configured on server" },
        { status: 500 }
      );
    }

    if (password !== configured) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true, authenticated: true });
    res.cookies.set("admin", "1", getCookieOptions());
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Login failed" }, { status: 500 });
  }
}


