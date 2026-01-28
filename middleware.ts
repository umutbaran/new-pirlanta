import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Eğer kullanıcı giriş yapmışsa ve login sayfasına gitmeye çalışıyorsa admin paneline yönlendir
    if (req.nextauth.token && req.nextUrl.pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Login sayfasına her zaman erişim izni ver
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = { 
  matcher: [
    "/admin/:path*",
    // Login sayfasını hariç tutmak için regex kullanamıyoruz ama next-auth bunu genelde kendi halleder.
    // Yine de en güvenlisi login sayfasını matcher'dan çıkarmak yerine, next-auth'un pages ayarını doğru yaptık.
  ] 
}