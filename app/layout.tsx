import type { Metadata } from "next";
import { LenisProvider } from "@/components/LenisProvider";
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
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
