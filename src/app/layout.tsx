import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { Provider } from "@/components/Provider";
import { QueryProvider } from "@/components/QueryProvider";
import { Toaster } from "@/components/Toaster";
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

export const metadata: Metadata = {
  title: "Palantir for the People",
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
            <Toaster />
          </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}
