"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await fetch("https://formspree.io/f/mnnokojw", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    setSubmitted(true);
  };

  return (
    <main
      style={{
        padding: "4rem 2rem",
        backgroundColor: "#fffaf0",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {!submitted ? (
        <>
          <h1
            style={{
              color: "#a0522d",
              textAlign: "center",
              fontSize: "2.5rem",
              marginBottom: "2rem",
            }}
          >
            💌 Contact BIYAYA
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#444",
              marginBottom: "3rem",
            }}
          >
            Have questions or want to partner with us? Send us a message below 🌿
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <label style={{ display: "block", marginBottom: "1rem", color: "#a0522d" }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                marginBottom: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label style={{ display: "block", marginBottom: "1rem", color: "#a0522d" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                marginBottom: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label style={{ display: "block", marginBottom: "1rem", color: "#a0522d" }}>
              Message
            </label>
            <textarea
              name="message"
              placeholder="Write your message here..."
              rows={5}
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "1.5rem",
              }}
            ></textarea>

            <button
              type="submit"
              style={{
                backgroundColor: "#a0522d",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "25px",
                fontSize: "1rem",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Send Message
            </button>
          </form>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "10rem",
          }}
        >
          <h2 style={{ color: "#a0522d", fontSize: "2rem" }}>🎉 Thank you!</h2>
          <p style={{ color: "#444", marginTop: "1rem" }}>
            Your message has been sent successfully.  
            We’ll get back to you soon 💌
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              marginTop: "2rem",
              backgroundColor: "#a0522d",
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            Send Another Message
          </button>
        </div>
      )}
    </main>
  );
}
