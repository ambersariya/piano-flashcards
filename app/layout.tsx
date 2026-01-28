import type { Metadata, Viewport } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://readnote.app"),
  title: "ReadNote Studio | Piano Sight Reading Trainer",
  description: "Master piano notes with real-time MIDI feedback. The interactive studio for musicians.",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    title: "ReadNote Studio | Piano Sight Reading Trainer",
    description: "Master piano notes with real-time MIDI feedback. The interactive studio for musicians.",
    images: ["/og-image.png"],
    url: "https://readnote.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadNote Studio | Piano Sight Reading Trainer",
    description: "Master piano notes with real-time MIDI feedback. The interactive studio for musicians.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ReadNote",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#09090b",
};

// Force static generation, disable dynamic rendering
export const dynamic = 'force-static';
export const dynamicParams = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
