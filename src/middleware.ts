import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  
  // Protect account and copilot routes
  if (req.nextUrl.pathname.startsWith('/account') || 
      req.nextUrl.pathname.startsWith('/copilot')) {
    
    if (!isLoggedIn) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', '/copilot')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/account/:path*", "/copilot/:path*"]
} 