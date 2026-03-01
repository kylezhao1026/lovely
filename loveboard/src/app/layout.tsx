import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LoveBoard - Your Cozy Couple Dashboard",
  description: "A cute long-distance relationship dashboard for couples",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cute bg-warm-cream min-h-screen text-gray-800 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
