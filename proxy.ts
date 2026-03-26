import { defaultLocale, isLocale } from "@/lib/i18n/config"
import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split("/")
  const maybeLocale = segments[1]

  if (!isLocale(maybeLocale)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname =
      pathname === "/"
        ? `/${defaultLocale}/home`
        : `/${defaultLocale}${pathname}`
    return NextResponse.redirect(redirectUrl)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", maybeLocale)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
