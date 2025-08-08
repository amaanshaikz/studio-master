import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  
  // Protect account, copilot, setup, and profile routes
  if (req.nextUrl.pathname.startsWith('/account') || 
      req.nextUrl.pathname.startsWith('/copilot') ||
      req.nextUrl.pathname.startsWith('/setup') ||
      req.nextUrl.pathname.startsWith('/profile')) {
    
    if (!isLoggedIn) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', '/setup')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/account/:path*", "/copilot/:path*", "/setup/:path*", "/profile/:path*"]
} 