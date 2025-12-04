  "use client";

  import { useEffect, useState } from "react";
  import { auth, db } from "@/app/lib/firebaseConfig";
  import { requireSupplier } from "@/app/lib/requireSupplier";
  import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
  } from "firebase/firestore";
function formatOrderNumber(id: string) {
  if (!id) return "";
  const YY = new Date().getFullYear().toString().slice(-2);
  const MM = String(new Date().getMonth() + 1).padStart(2, "0");
  const last5 = id.slice(-5).toUpperCase();
  return `BIYAYA-${YY}${MM}-${last5}`;
}

  function SupplierDashboard() {
    const [products, setProducts] = useState<any[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);

    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const user = auth.currentUser;

    // ================================
    // LOAD SUPPLIER PRODUCTS
    // ================================
    useEffect(() => {
      async function loadProducts() {
        if (!user) return;

        const q = query(
          collection(db, "products"),
          where("supplierId", "==", user.uid)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setProducts(list);
        setTotalProducts(list.length);
      }

      loadProducts();
    }, [user]);

    // ================================
    // LOAD ORDERS THAT BELONG TO SUPPLIER
    // ================================
    useEffect(() => {
      async function loadOrders() {
        if (!user) return;

        const ordersSnap = await getDocs(collection(db, "orders"));
        const supplierOrders: any[] = [];

        ordersSnap.forEach((orderDoc) => {
          const data = orderDoc.data();
          const supplierItems = data.items?.filter(
            (item: any) => item.supplierId === user.uid
          );

          if (Array.isArray(supplierItems) && supplierItems.length > 0) {
            supplierOrders.push({
              orderId: orderDoc.id,
              ...data,
              supplierItems,
            });
          }
        });

        setOrders(supplierOrders);
        setLoadingOrders(false);
      }

      loadOrders();
    }, [user]);

    // ================================
    // STATUS UPDATE FUNCTIONS
    // ================================
    async function approveOrder(orderId: string) {
      await updateDoc(doc(db, "orders", orderId), { status: "approved" });
      alert("Order approved!");
      location.reload();
    }

    async function rejectOrder(orderId: string) {
      const reason = prompt("Enter reason for rejection:");
      if (!reason) return;

      await updateDoc(doc(db, "orders", orderId), {
        status: "rejected",
        rejectionReason: reason,
      });

      alert("Order rejected!");
      location.reload();
    }

    async function markProcessing(orderId: string) {
      await updateDoc(doc(db, "orders", orderId), { status: "processing" });
      alert("Order marked as Processing");
      location.reload();
    }

    async function markShipped(orderId: string) {
      await updateDoc(doc(db, "orders", orderId), { status: "shipped" });
      alert("Order marked as Shipped");
      location.reload();
    }

    async function markDelivered(orderId: string) {
      await updateDoc(doc(db, "orders", orderId), { status: "delivered" });
      alert("Order marked as Delivered");
      location.reload();
    }

    async function markCompleted(orderId: string) {
      await updateDoc(doc(db, "orders", orderId), { status: "completed" });
      alert("Order marked as Completed");
      location.reload();
    }

    // ================================
    // UI
    // ================================
    return (
      <main style={{ padding: "4rem 1rem", maxWidth: 1200, margin: "0 auto" }}>
        {/* TITLE */}
        <h1
          style={{
            color: "#8B4513",
            fontWeight: 700,
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          Supplier Dashboard
        </h1>

        {/* TOP STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
            }}
          >
            <p style={{ fontSize: "2rem", fontWeight: 700 }}>{totalProducts}</p>
            <p style={{ opacity: 0.6 }}>Total Products</p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
            }}
          >
            <p style={{ fontSize: "2rem", fontWeight: 700 }}>₱0</p>
            <p style={{ opacity: 0.6 }}>Total Sales (Coming soon)</p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
            }}
          >
            <p style={{ fontSize: "2rem", fontWeight: 700 }}>{orders.length}</p>
            <p style={{ opacity: 0.6 }}>Orders Received</p>
          </div>
        </div>

        {/* HEADER + BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", fontWeight: 600 }}>Your Products</h2>

          <a
            href="/suppliers/upload"
            style={{
              backgroundColor: "#8B4513",
              color: "white",
              padding: "0.7rem 1.2rem",
              borderRadius: 12,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            + Add Product
          </a>
        </div>

        {/* PRODUCT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {products.map((p: any) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={p.images?.[0] || "/no-image.png"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />

              <p style={{ marginTop: "1rem", fontWeight: 600 }}>{p.name}</p>
              <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>{p.category}</p>
              <p style={{ fontWeight: 700, marginTop: "0.5rem", color: "#8B4513" }}>
                ₱{p.price}
              </p>

              <a
                href={`/suppliers/edit/${p.id}`}
                style={{
                  display: "block",
                  marginTop: "1rem",
                  padding: "0.7rem",
                  textAlign: "center",
                  backgroundColor: "#D4A373",
                  color: "white",
                  borderRadius: 10,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ✏ Edit
              </a>
            </div>
          ))}
        </div>

        {/* ================================
            ORDERS RECEIVED
        ================================ */}
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "#8B4513",
          }}
        >
          Orders Received
        </h2>

        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No orders yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {orders.map((o, idx) => {
              const supplierTotal = o.supplierItems.reduce(
                (sum: number, i: any) => sum + i.subtotal,
                0
              );

              return (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    padding: "1.5rem",
                    borderRadius: 16,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ fontWeight: 700 }}>
  Order ID: {formatOrderNumber(o.orderId)}
</h3>

                  {/* BADGES */}
                  {o.status === "approved" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#4CAF50",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      ✔ Approved
                    </span>
                  )}

                  {o.status === "processing" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#6C8EBF",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      🔄 Processing
                    </span>
                  )}

                  {o.status === "shipped" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#FF9900",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      📦 Shipped
                    </span>
                  )}

                  {o.status === "delivered" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#008CBA",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      🚚 Delivered
                    </span>
                  )}

                  {o.status === "completed" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#2E8B57",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      🏁 Completed
                    </span>
                  )}

                  {o.status === "pending" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#D4A373",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      ⏳ Pending
                    </span>
                  )}

                  {o.status === "rejected" && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#B22222",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 20,
                        margin: "10px 0",
                      }}
                    >
                      ✖ Rejected
                    </span>
                  )}

                  {/* BUYER INFO */}
                 <p style={{ margin: "10px 0" }}>
  <b>Buyer:</b> {o.shipName} <br />
  <b>Address:</b> {o.shipAddress} <br />
  <b>Phone:</b> {o.shipPhone} <br />
  <b>Payment Method:</b>{" "}
  <span style={{ color: "#8B4513", fontWeight: 600 }}>
    {o.paymentMethod?.toUpperCase() || "NOT SPECIFIED"}
</span>
</p>

                  {/* ITEMS */}
                  {o.supplierItems.map((it: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.7rem 0",
                      }}
                    >
                      <p>
                        <b>{it.name}</b>
                      </p>
                      <p>
                        {it.qty} × ₱{it.price}
                      </p>
                      <p style={{ fontWeight: 600 }}>Subtotal: ₱{it.subtotal}</p>
                    </div>
                  ))}

                  {/* SUPPLIER TOTAL */}
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#8B4513",
                      marginTop: "1rem",
                    }}
                  >
                    Supplier Total: ₱{supplierTotal}
                  </p>

                  {/* rejection reason */}
                  {o.status === "rejected" && o.rejectionReason && (
                    <p
                      style={{
                        background: "#ffe6e6",
                        padding: "0.8rem",
                        borderRadius: 10,
                        color: "#a30000",
                        marginTop: "1rem",
                      }}
                    >
                      <b>Rejection Reason:</b> {o.rejectionReason}
                    </p>
                  )}

                  {/* STATUS UPDATE BUTTONS */}
                  <div
                    style={{
                      marginTop: "1.5rem",
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {o.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveOrder(o.orderId)}
                          style={{
                            flex: 1,
                            padding: "0.7rem",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            borderRadius: 10,
                            fontWeight: 600,
                          }}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectOrder(o.orderId)}
                          style={{
                            flex: 1,
                            padding: "0.7rem",
                            backgroundColor: "#B22222",
                            color: "white",
                            borderRadius: 10,
                            fontWeight: 600,
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {o.status === "approved" && (
                      <button
                        onClick={() => markProcessing(o.orderId)}
                        style={{
                          flex: 1,
                          padding: "0.7rem",
                          backgroundColor: "#6C8EBF",
                          color: "white",
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        Mark as Processing
                      </button>
                    )}

                    {o.status === "processing" && (
                      <button
                        onClick={() => markShipped(o.orderId)}
                        style={{
                          flex: 1,
                          padding: "0.7rem",
                          backgroundColor: "#FF9900",
                          color: "white",
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        Mark as Shipped
                      </button>
                    )}

                    {o.status === "shipped" && (
                      <button
                        onClick={() => markDelivered(o.orderId)}
                        style={{
                          flex: 1,
                          padding: "0.7rem",
                          backgroundColor: "#008CBA",
                          color: "white",
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        Mark as Delivered
                      </button>
                    )}

                    {o.status === "delivered" && (
                      <button
                        onClick={() => markCompleted(o.orderId)}
                        style={{
                          flex: 1,
                          padding: "0.7rem",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    );
  }

  export default requireSupplier(SupplierDashboard);
