import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { ConsoleSignature } from "@/components/ConsoleSignature";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { Provider } from "@/components/Provider";
import { QueryProvider } from "@/components/QueryProvider";
import { Toaster } from "@/components/Toaster";
import { SiteFooter } from "@/components/dashboard/SiteFooter";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import "./globals.css";

// Heading: Newsreader (locally hosted, OFL-licensed editorial serif from Google).
// Variable axes: opsz (9–144), wght (200–800) — single file covers all weights/sizes.
const heading = localFont({
  src: [
    {
      path: "./fonts/Newsreader-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/Newsreader-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

// Body: Geist (OFL, variable wght 100–900)
const body = localFont({
  src: "./fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-body",
  display: "swap",
});

// Mono: Departure Mono is the design intent — JetBrains Mono substitute until that font is hosted locally.

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const SITE_DESCRIPTION =
  "A verification tool for newsrooms. A transparent agent grades whistleblower claims and source documents, then surfaces the strongest leads first.";

export const metadata: Metadata = {
  title: "Palantir for the People",
  description: SITE_DESCRIPTION,
  applicationName: "Palantir for the People",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Palantir for the People",
    title: "Palantir for the People",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Palantir for the People",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palantir for the People",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <Provider>
          <QueryProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <KeyboardShortcuts />
            <Toaster />
            <ConsoleSignature />
          </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}
