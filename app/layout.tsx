import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ImagePrefetch } from "@/components/ImagePrefetch";
import "./globals.css";

// Runs before React hydrates so the correct theme is applied on first paint
// (no flash of the wrong theme). Kept tiny and defensive — storage or
// matchMedia access can throw in some privacy modes.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("tellclick-theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

const SITE_URL = "https://www.tellclick.ca";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#10263a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tellclick Inc. | Canadian Enterprise Technology Since 2009",
    template: "%s | Tellclick Inc.",
  },
  description:
    "Tellclick Inc. is a Canadian enterprise technology company with experience across infrastructure, cloud, cybersecurity, automation and enterprise operations.",
  openGraph: {
    type: "website",
    siteName: "Tellclick Inc.",
    title: "Tellclick Inc. | Canadian Enterprise Technology Since 2009",
    description:
      "Tellclick Inc. is a Canadian enterprise technology company with experience across infrastructure, cloud, cybersecurity, automation and enterprise operations.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tellclick Inc. | Canadian Enterprise Technology Since 2009",
    description:
      "Tellclick Inc. is a Canadian enterprise technology company with experience across infrastructure, cloud, cybersecurity, automation and enterprise operations.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tellclick Inc.",
  url: SITE_URL,
  description:
    "Tellclick Inc. is a Canadian enterprise technology company established in 2009, built on experience across infrastructure, cloud, cybersecurity, automation and enterprise operations.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Ontario",
    addressCountry: "CA",
  },
  email: "info@tellclick.ca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider>
          <ImagePrefetch />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
