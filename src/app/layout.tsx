import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "BIYAYA",
  description: "From The Islands To The World",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#fff", margin: 0, padding: 0 }}>
        <Navbar />

        {/* RESTORE OLD UI SPACING (this is what your old version used) */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
