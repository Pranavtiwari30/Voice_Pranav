import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Manrope } from "next/font/google";
import { cn } from "@/lib/utils";

import { TooltipProvider } from "@/components/ui/tooltip";

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Pranav Tiwari — Voice Interview Assistant',
  description:
    'An interactive voice-enabled AI assistant representing Pranav Tiwari in an interview conversation. Built with Gemini, Web Speech API, and Next.js.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark", "font-sans", manrope.variable)}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-foreground min-h-screen antialiased selection:bg-primary selection:text-primary-foreground"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

