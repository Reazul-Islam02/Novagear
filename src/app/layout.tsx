import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MainLayoutWrapper } from "@/components/MainLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovaGear | Premium Gadgets for the Future",
  description: "Discover the most advanced electronics and gadgets at NovaGear. Your one-stop shop for premium tech.",
  openGraph: {
    title: "NovaGear | Premium Gadgets",
    description: "Premium electronics & gadgets marketplace.",
    url: "https://novagear.com",
    siteName: "NovaGear",
    images: [{ url: "https://novagear.com/og-image.jpg" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
