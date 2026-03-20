import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/create", "/course"];

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Check for Firebase auth session cookie
    const session = req.cookies.get("firebase-auth-token");

    if (!session) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
