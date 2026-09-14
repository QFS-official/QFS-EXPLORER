import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#001438",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://explorer.qfspay.org"),
  title: "QFS Explorer | Explore the QFS Network",
  description:
    "Explore transactions, wallets, tokens, contracts and network activity on the QFS blockchain.",
  keywords: ["QFS", "Explorer", "Blockchain", "Polygon", "Transactions", "Tokens"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "QFS Explorer | Explore the QFS Network",
    description:
      "Explore transactions, wallets, tokens, contracts and network activity on the QFS blockchain.",
    url: "https://explorer.qfspay.org",
    siteName: "QFS Explorer",
    images: [{ url: "/qfs-logo.png", width: 1254, height: 1254, alt: "QFS Explorer" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QFS Explorer | Explore the QFS Network",
    description:
      "Explore transactions, wallets, tokens, contracts and network activity on the QFS blockchain.",
    images: ["/qfs-logo.png"],
  },
};

// Applies persisted theme + language before first paint (no flash of wrong theme)
const themeBoot = `(function(){try{var t=localStorage.getItem("qfs-theme");var l=localStorage.getItem("qfs-lang");var r=document.documentElement;r.classList.remove("dark","light");r.classList.add(t==="light"?"light":"dark");if(l){r.lang=l;if(l==="ar"){r.dir="rtl"}else{r.dir="ltr"}}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030816] text-slate-200`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
