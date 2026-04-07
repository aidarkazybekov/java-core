import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Java Core — Interview Prep",
  description: "Interactive Java learning platform for technical interview preparation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary">{children}</body>
    </html>
  );
}
