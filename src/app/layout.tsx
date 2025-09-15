import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TUS Report",
  description: "TUS Report System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={`${notoSansJP.variable}`}>
          <AuthProvider>
            <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
              {/* Header */}
              {/* 共通ヘッダー */}

              <Header />
              <div style={{flex: 1}}>
                {children}
              </div>
            </div>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
