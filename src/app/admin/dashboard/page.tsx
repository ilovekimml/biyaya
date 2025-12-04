"use client";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-[#8B4513]">Admin</h2>

        <nav className="flex flex-col gap-4 text-[#5A5A5A] font-medium">
          <a href="/admin/dashboard" className="hover:text-[#8B4513]">Dashboard</a>
          <a href="/admin/users" className="hover:text-[#8B4513]">Users</a>
          <a href="/admin/suppliers" className="hover:text-[#8B4513]">Suppliers</a>
          <a href="/admin/products" className="hover:text-[#8B4513]">Products</a>
          <a href="/admin/orders" className="hover:text-[#8B4513]">Orders</a>
          <a href="/admin/settings" className="hover:text-[#8B4513]">Settings</a>
        </nav>

        <div className="mt-auto pt-6 border-t">
          <a href="/" className="text-red-600 font-semibold hover:underline">
            Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#8B4513] mb-6">
          BIYAYA Admin Dashboard
        </h1>

        {/* Stats / Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-3xl font-bold mt-2 text-[#8B4513]">134</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Suppliers</h3>
            <p className="text-3xl font-bold mt-2 text-[#8B4513]">42</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Products</h3>
            <p className="text-3xl font-bold mt-2 text-[#8B4513]">321</p>
          </div>

        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow mt-10">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

          <p className="text-gray-600">
            Activity logs will appear here (e.g., new suppliers, product updates, orders).
          </p>
        </div>

      </main>
    </div>
  );
}
