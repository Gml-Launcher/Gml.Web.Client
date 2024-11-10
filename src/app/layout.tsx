import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { config } from "@/core/configs";
import { QueryProvider, ThemeProvider, TooltipProvider } from "@/core/providers";
import { cn } from "@/shared/lib/utils";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: config.name,
  description: `Официальный сайт ${config.name}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
