import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canva Short Creator",
  description: "AI-powered shorts creator with video editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
