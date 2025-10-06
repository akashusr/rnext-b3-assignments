

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";

const locales = ["en", "bn"];
const defaultLocale = "en";

function getPreferredLocale(request) {
  // 1. Try cookie
  const cookieLocale = request.cookies.get("lang")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // 2. Fallback to Accept-Language header
  const acceptLangHeader = request.headers.get("accept-language") ?? undefined;
  const languages = new Negotiator({
    headers: { "accept-language": acceptLangHeader }
  }).languages();

  return match(languages, locales, defaultLocale);
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const pathNameIsMissingLocale = locales.every(
    locale =>
      !pathname.startsWith(`/${locale}`) && !pathname.startsWith(`/${locale}/`)
  );

  if (pathNameIsMissingLocale) {
    const locale = getPreferredLocale(request);

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)"]
};
