import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/postlogin", "/user","/candidate/add"];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the path is a public route
    if (publicRoutes.includes(path)) {
        return NextResponse.next();
    }

    // Get the authentication status from the cookies
    const authCookie = request.cookies.get("auth-storage");
    let isAuthenticated = false;

    if (authCookie) {
        try {
            // Parse the cookie value
            const cookieValue = JSON.parse(authCookie.value);

            // If cookieValue is a string, parse it again
            const authData =
                typeof cookieValue === "string"
                    ? JSON.parse(cookieValue)
                    : cookieValue;

            // Check for authenticated status
            isAuthenticated =
                authData.state?.authenticated ||
                authData.authenticated ||
                false;
        } catch (error) {
            console.error("Error parsing auth cookie:", error);
        }
    }

    // If not authenticated and trying to access a protected route, redirect to login
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If authenticated, allow the request to continue
    return NextResponse.next();
}

// Specify which routes the middleware should run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
