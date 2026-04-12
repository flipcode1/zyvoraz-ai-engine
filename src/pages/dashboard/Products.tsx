import { useState } from "react";
import { Package, Filter } from "lucide-react";
import { CHAMPION_PRODUCTS, NICHES } from "@/lib/mock-data";
import ProductCard from "@/components/dashboard/ProductCard";
import ProductDetail from "@/components/dashboard/ProductDetail";

const Products = () => {
  const [nicheFilter, setNicheFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const filtered = nicheFilter
    ? CHAMPION_PRODUCTS.filter((p) => p.niche === nicheFilter)
    : CHAMPION_PRODUCTS;

  const product = CHAMPION_PRODUCTS.find((p) => p.id === selectedProduct);

  if (product) {
    return <ProductDetail product={product} onBack={() => setSelectedProduct(null)} />;
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
            <option key={n.id} value={n.id}>{n.name}</option>
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
