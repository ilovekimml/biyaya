export const metadata = {
  title: "BIYAYA",
  description: "From the Islands to the World",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff9e6",
        }}
      >
        {/* Navigation Bar */}
        <header
          style={{
            backgroundColor: "#fff9e6",
            borderBottom: "2px solid #f4d03f",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <h1
            style={{
              color: "#a0522d",
              fontWeight: "bold",
              fontSize: "1.8rem",
              margin: 0,
            }}
          >
            BIYAYA
          </h1>

          <nav>
            <ul
              style={{
                display: "flex",
                gap: "2rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <a href="#" style={{ textDecoration: "none", color: "#444" }}>Home</a>
              </li>
              <li>
                <a href="#products" style={{ textDecoration: "none", color: "#444" }}>Products</a>
              </li>
              <li>
                <a href="#suppliers" style={{ textDecoration: "none", color: "#444" }}>Suppliers</a>
              </li>
              <li>
                <a href="#contact" style={{ textDecoration: "none", color: "#444" }}>Contact</a>
              </li>
            </ul>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
