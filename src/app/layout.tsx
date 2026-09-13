import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "QFS Explorer | Explore the QFS Network",
  description:
    "Explore transactions, wallets, tokens, contracts and network activity on the QFS blockchain.",
  keywords: ["QFS", "Explorer", "Blockchain", "Polygon", "Transactions", "Tokens"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
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
