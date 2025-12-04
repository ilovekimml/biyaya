export default function MessageSent() {
  return (
    <div className="p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Message Sent!</h1>
      <p className="text-lg mb-6">
        Your message has been delivered to the supplier.  
        They will contact you soon.
      </p>

      <a
        href="/products"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
      >
        Back to Products
      </a>
    </div>
  );
}
