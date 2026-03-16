import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signIn",
  },
});

export const config = {
  matcher: [
    "/add",
    "/add/:path*",
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/mykudos",
    "/mykudos/:path*",
    "/post/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
