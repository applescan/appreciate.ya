import Providers from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import AppBar from "@/components/ui/AppBar";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Appreciate Ya",
  description:
    "Let us celebrate each other by encouraning and exchanging gifts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${display.variable} min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)] antialiased`}
      >
        <Providers>
          <AppBar />
          <div className="flex-grow">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
