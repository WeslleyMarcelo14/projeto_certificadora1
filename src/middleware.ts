import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Define quais rotas devem ser protegidas por senha
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
