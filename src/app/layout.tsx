import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import { Toaster as SonnerToaster } from "sonner"
import { Toaster } from "~/components/ui/toaster";
import Navbar from "~/components/Navbar";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <div className="px-[36px] mb-[36px]">
          <div className="h-[65px] items-center flex w-full">
            <Navbar />
          </div>
          {children}
          <SonnerToaster />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
