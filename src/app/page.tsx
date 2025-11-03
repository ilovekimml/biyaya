export default function Home() {
  return (
    <main
      style={{
        padding: "4rem 2rem",
        textAlign: "center",
        backgroundColor: "#fff9e6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#a0522d",
          fontSize: "3rem",
          marginBottom: "0.5rem",
          fontWeight: "bold",
        }}
      >
        BIYAYA
      </h1>

      <p style={{ fontSize: "1.2rem", color: "#333" }}>
        From the Islands to the World — Showcasing Filipino Excellence 🌸
      </p>

      <div style={{ marginTop: "2rem" }}>
        <button
          style={{
            backgroundColor: "#a0522d",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            fontSize: "1rem",
            borderRadius: "25px",
            marginRight: "1rem",
            cursor: "pointer",
          }}
        >
          Explore Products
        </button>

        <button
          style={{
            backgroundColor: "transparent",
            color: "#a0522d",
            border: "2px solid #a0522d",
            padding: "1rem 2rem",
            fontSize: "1rem",
            borderRadius: "25px",
            cursor: "pointer",
          }}
        >
          Become a Supplier
        </button>
      </div>

      <section style={{ marginTop: "4rem" }}>
        <h2
          style={{
            color: "#a0522d",
            fontSize: "1.8rem",
            marginBottom: "1rem",
          }}
        >
          🇵🇭 Proudly Made in the Philippines
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#444", maxWidth: "800px", margin: "0 auto" }}>
          BIYAYA connects Filipino farmers, artisans, and entrepreneurs to the global market — 
          empowering local communities and celebrating the creativity and richness of the Philippines.
        </p>
      </section>       {/* Explore Products Section */}
      <section
        id="products"
        style={{
          marginTop: "5rem",
          backgroundColor: "#fff1cc",
          padding: "4rem 2rem",
          borderTop: "3px solid #f4d03f",
          borderBottom: "3px solid #f4d03f",
        }}
      >
        <h2
          style={{
            color: "#a0522d",
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "2rem",
          }}
        >
          🌴 Explore Filipino Products
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Product 1 */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "1.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba2"
              alt="Coconut Oil"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h3 style={{ color: "#a0522d", marginTop: "1rem" }}>Coconut Oil</h3>
            <p style={{ color: "#555" }}>
              Pure, organic coconut oil sourced from Davao — a symbol of Filipino quality.
            </p>
            <button
              style={{
                marginTop: "1rem",
                backgroundColor: "#a0522d",
                color: "white",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "25px",
                cursor: "pointer",
              }}
            >
              View Product
            </button>
          </div>

          {/* Product 2 */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "1.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1615474444746-5b3c54b52d57"
              alt="Woven Bags"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h3 style={{ color: "#a0522d", marginTop: "1rem" }}>Woven Bags</h3>
            <p style={{ color: "#555" }}>
              Handcrafted bayong-style bags from local artisans in Bicol and Iloilo.
            </p>
            <button
              style={{
                marginTop: "1rem",
                backgroundColor: "#a0522d",
                color: "white",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "25px",
                cursor: "pointer",
              }}
            >
              View Product
            </button>
          </div>

          {/* Product 3 */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "1.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
              alt="Coffee Beans"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h3 style={{ color: "#a0522d", marginTop: "1rem" }}>Coffee Beans</h3>
            <p style={{ color: "#555" }}>
              Premium Arabica and Robusta beans from Batangas and Benguet.
            </p>
            <button
              style={{
                marginTop: "1rem",
                backgroundColor: "#a0522d",
                color: "white",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "25px",
                cursor: "pointer",
              }}
            >
              View Product
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
