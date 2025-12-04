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
      <body>
        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}
