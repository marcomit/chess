import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { navbarItem } from "./config/navbar";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = navbarItem.map(item => item.href);
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (pathname === "/") return NextResponse.next();

    if (isLoginPage) {
      if (isAuth) return NextResponse.redirect(new URL("/home", req.url));
      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute)
      return NextResponse.redirect(new URL("/login", req.url));

    //if (pathname === "/")
    //  return NextResponse.redirect(new URL("/dashboard", req.url));
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matchter: ["/:path*"],
};
