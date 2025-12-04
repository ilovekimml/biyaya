"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  "/home/el-nido.jpg.png",
  "/home/islands.jpg.png",
  "/home/rice-terraces.jpg.png",
  "/home/sunset.jpg.png",
  "/home/sierra-madre.jpg.png",
];

export default function Home() {
  const [index, setIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
<header className="navbar">
  <div className="navbar-inner">
    <Link href="/" className="navbar-logo">BIYAYA</Link>

    <nav className="navbar-links">
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/about">About PH</Link>
    </nav>

    <Link href="/login" className="navbar-login">Login</Link>
  </div>
</header>

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">

          {/* IMAGES */}
          {images.map((src, i) => (
            <div
              key={src}
              className={`hero-image-layer ${
                i === index ? "hero-image-active" : ""
              }`}
            >
              <Image
                src={src}
                alt="Biyaya Hero Image"
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}

          {/* GRADIENT */}
          <div className="hero-gradient" />

          {/* TEXT CONTENT */}
          <div className="hero-content">
            <h1 className="hero-logo">BIYAYA</h1>

            <p className="hero-tagline">
              <span className="hero-tagline-text">
                From The Islands To The World
              </span>
            </p>

            <p className="hero-sub">
              Proudly Philippine-born Global Marketplace
            </p>

            <div className="hero-buttons">
              <Link href="/suppliers/upload" className="hero-btn hero-btn-primary">
  Become a Supplier
</Link>

              <Link href="/products" className="hero-btn hero-btn-secondary">
                Explore Products
              </Link>
            </div>
          </div>

          {/* DOTS */}
          <div className="hero-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === index ? "hero-dot-active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}

console.log("🔥 Using NEW Homepage");
