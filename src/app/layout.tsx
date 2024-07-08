import type { Metadata } from "next";

import { Manrope } from "next/font/google";

import "./globals.css";
import { QueryProvider } from "@/core/providers/QueryProvider";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import { TooltipProvider } from "@/core/providers/TooltipProvider";
import { cn } from "@/shared/lib/utils";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GML Frontend",
  description: "Официальный сайт GML",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", manrope.variable)}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
          <Toaster />
          <Sonner position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
