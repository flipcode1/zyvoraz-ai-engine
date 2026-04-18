import { useState, useEffect } from "react";
import { Package, Filter } from "lucide-react";
import { NICHES } from "@/lib/mock-data";
import ProductCard from "@/components/dashboard/ProductCard";
import ProductDetail from "@/components/dashboard/ProductDetail";

// URLs do Supabase
const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

const Products = () => {
  const [nicheFilter, setNicheFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar produtos do Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const data = await response.json();

        if (data && data.length > 0) {
          const formattedProducts = data.map((p: any) => ({
            id: String(p.id),
            name: p.title,
            image: p.image_url,
            price: p.price,
            sellPrice: p.price,
            niche: p.category || "general",
            trendLevel: p.trendlevel || "stable",
            profitMargin: p.margin ? `${p.margin}%` : "30%",
            orders: String(p.sales || 0),
            source: p.supplier || "AliExpress",
            description: p.title,
            benefits: ["Alta demanda", "Boa margem", "Fornecedor confiável"],
            targetAudience: "Empreendedores digitais",
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filtered = nicheFilter ? products.filter((p) => p.niche === nicheFilter) : products;

  const product = products.find((p) => p.id === selectedProduct);

  if (product) {
    return <ProductDetail product={product} onBack={() => setSelectedProduct(null)} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
        <div className="h-10 bg-muted rounded animate-pulse w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-72 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Package size={28} className="text-primary" /> Products
        </h1>
        <p className="text-muted-foreground">Browse product catalog</p>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <Filter size={14} className="text-muted-foreground" />
        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
          className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Niches</option>
          {NICHES.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p.id)} />
        ))}
      </div>
    </div>
  );
};

export default Products;
