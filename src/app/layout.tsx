import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ReadNote Studio",
  description: "Sight-reading trainer for piano notes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
