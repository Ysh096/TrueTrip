import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { Toast } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "TrueTrip - AI Travel Planner",
  description: "Reliable Data, Historical Depth, and Realistic Scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalLoader />
        <Toast />
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
