import { useState, useEffect } from "react";

const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    price: "",
    image_url: "",
    category: "",
    supplier: "AliExpress",
    margin: "30",
    sales: "0",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      console.log("Fetching products...");

      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("HTTP error:", response.status);
        setProducts([]);
        return;
      }

      const data = await response.json();
      console.log("Data received:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Data is not an array:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const productData = {
      title: form.title,
      price: parseFloat(form.price),
      image_url: form.image_url,
      category: form.category,
      supplier: form.supplier,
      margin: parseFloat(form.margin),
      sales: parseInt(form.sales),
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${editingId}`, {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
        if (response.ok) alert("Product updated!");
      } else {
        response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
        if (response.ok) alert("Product added!");
      }

      if (!response?.ok) {
        const error = await response?.text();
        console.error("Error response:", error);
        alert("Error saving product.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error saving product");
    }

    setForm({ title: "", price: "", image_url: "", category: "", supplier: "AliExpress", margin: "30", sales: "0" });
    setEditingId(null);
    fetchProducts();
  }

  function editProduct(product: any) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: product.price,
      image_url: product.image_url || "",
      category: product.category || "",
      supplier: product.supplier || "AliExpress",
      margin: product.margin,
      sales: product.sales,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok) {
        alert("Product deleted!");
        fetchProducts();
      } else {
        alert("Error deleting product");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error deleting product");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Products</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Product" : "New Product"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price (€)"
            step="0.01"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <select
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          >
            <option>AliExpress</option>
            <option>Shein</option>
            <option>TikTok Shop</option>
            <option>Amazon</option>
          </select>
          <input
            type="number"
            placeholder="Margin (%)"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.margin}
            onChange={(e) => setForm({ ...form, margin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Sales"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={form.sales}
            onChange={(e) => setForm({ ...form, sales: e.target.value })}
          />
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    title: "",
                    price: "",
                    image_url: "",
                    category: "",
                    supplier: "AliExpress",
                    margin: "30",
                    sales: "0",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Registered Products ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.length > 0 ? (
          products.map((p: any) => (
            <div key={p.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <img
                src={p.image_url || "https://via.placeholder.com/300"}
                alt={p.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-green-600">€{p.price}</p>
              <p className="text-sm text-gray-500">
                Margin: {p.margin}% | Sales: {p.sales}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => editProduct(p)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No products found. Click "Add" to create your first product.
          </div>
        )}
      </div>
    </div>
  );
}
