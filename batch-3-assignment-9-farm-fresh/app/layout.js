import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import FavoriteProvider from "@/context/FavoriteProvider";
import CartProvider from "@/context/CartProvider";
import dynamic from "next/dynamic";
import { SITE, getBaseUrl } from "@/lib/seo";

const ChunkErrorReload = dynamic(
  () => import("@/components/common/ChunkErrorReload"),
  { ssr: false }
);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const baseUrl = getBaseUrl();

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.defaultDescription,
    url: baseUrl,
    siteName: SITE.name,
    images: [
      {
        url: SITE.defaultImage,
        alt: SITE.tagline,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.defaultDescription,
    images: [SITE.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try {const stored=localStorage.getItem('theme');const prefers=window.matchMedia('(prefers-color-scheme: dark)').matches;const useDark = stored==='dark' || (!stored || stored==='system') && prefers; if(useDark){document.documentElement.classList.add('dark');} else {document.documentElement.classList.remove('dark');}} catch(e) {}})();`,
          }}
        />
        <SessionProvider>
          <CartProvider>
            <FavoriteProvider>
              <ThemeProvider>
                <Navbar />
                <ChunkErrorReload />
                {children}
                <Footer />
                {modal}
              </ThemeProvider>
            </FavoriteProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
