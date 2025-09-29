import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  
  // Protect account, copilot, setup, profile, connect-instagram, and engagement-predictor routes
  if (req.nextUrl.pathname.startsWith('/account') || 
      req.nextUrl.pathname.startsWith('/copilot') ||
      req.nextUrl.pathname.startsWith('/setup') ||
      req.nextUrl.pathname.startsWith('/profile') ||
      req.nextUrl.pathname.startsWith('/connect-instagram') ||
      req.nextUrl.pathname.startsWith('/engagement-predictor')) {
    
    if (!isLoggedIn) {
      const url = new URL('/login', req.url)
      // Set appropriate callback URL based on the route
      const callbackUrl = req.nextUrl.pathname.startsWith('/connect-instagram') 
        ? '/connect-instagram' 
        : req.nextUrl.pathname.startsWith('/engagement-predictor')
        ? '/engagement-predictor'
        : '/setup'
      url.searchParams.set('callbackUrl', callbackUrl)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/account/:path*", "/copilot/:path*", "/setup/:path*", "/profile/:path*", "/connect-instagram/:path*", "/engagement-predictor/:path*"]
} 