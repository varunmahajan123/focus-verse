import type { Metadata } from "next";
import { LenisProvider } from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOCUSVERSE | Scroll-Powered Productivity Universe",
  description:
    "A cinematic Pomodoro planner landing page that enters a 3D focus loop universe.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-foreground bg-background">
        <ThemeProvider>
          <LenisProvider>{children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
