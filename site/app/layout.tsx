import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Display serif for headlines; optical sizing keeps it fine at large sizes.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const description =
  "An open source context structure that gives AI coding agents persistent memory of your project. Coming soon.";

const title = "Contextual: explain your project once"

/*
 * Share card: app/opengraph-image.png and app/twitter-image.png (1200x630),
 * with alt text beside them. Next adds the og:image and twitter:image tags.
 */
export const metadata: Metadata = {
  // Absolute links for the share card and canonical URL. Vercel fills this in
  // on its own; elsewhere, set SITE_URL (for example https://contextual.dev).
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title,
  description,
  applicationName: "Contextual",
  keywords: [
    "Contextual",
    "Claude Code",
    "Codex",
    "AI coding agents",
    "project memory",
    "context engineering",
    "open source",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Contextual",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#db3300",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
