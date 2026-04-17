"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  // Buscar produtos
  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  // Salvar produto (criar ou editar)
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

    if (editingId) {
      await supabase.from("products").update(productData).eq("id", editingId);
      alert("Produto atualizado!");
    } else {
      await supabase.from("products").insert([productData]);
      alert("Produto adicionado!");
    }

    // Limpar formulário
    setForm({ title: "", price: "", image_url: "", category: "", supplier: "AliExpress", margin: "30", sales: "0" });
    setEditingId(null);
    fetchProducts();
  }

  // Editar produto
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

  // Deletar produto
  async function deleteProduct(id: string) {
    if (confirm("Tem certeza?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Painel Admin - Produtos</h1>

      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Editar Produto" : "Novo Produto"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Título"
            className="p-2 border rounded dark:bg-gray-700"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Preço (€)"
            step="0.01"
            className="p-2 border rounded dark:bg-gray-700"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="URL da Imagem"
            className="p-2 border rounded dark:bg-gray-700"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <input
            type="text"
            placeholder="Categoria"
            className="p-2 border rounded dark:bg-gray-700"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <select
            className="p-2 border rounded dark:bg-gray-700"
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
            placeholder="Margem (%)"
            className="p-2 border rounded dark:bg-gray-700"
            value={form.margin}
            onChange={(e) => setForm({ ...form, margin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Vendas"
            className="p-2 border rounded dark:bg-gray-700"
            value={form.sales}
            onChange={(e) => setForm({ ...form, sales: e.target.value })}
          />
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingId ? "Atualizar" : "Cadastrar"}
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
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de produtos */}
      <h2 className="text-xl font-semibold mb-4">Produtos Cadastrados ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <img
              src={p.image_url || "https://via.placeholder.com/300"}
              alt={p.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-green-600">€{p.price}</p>
            <p className="text-sm text-gray-500">
              Margem: {p.margin}% | Vendas: {p.sales}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => editProduct(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
