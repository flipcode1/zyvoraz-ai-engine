import { useState } from "react";
import { CHAMPION_PRODUCTS, TRENDING_ADS, NICHES, COUNTRIES } from "@/lib/mock-data";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { Crown, Filter, TrendingUp, Tv } from "lucide-react";

type SubTab = "champions" | "ads" | "trending";

const MarketplaceSection = () => {
  const [subTab, setSubTab] = useState<SubTab>("champions");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState("");

  const filteredProducts = nicheFilter
    ? CHAMPION_PRODUCTS.filter(p => p.niche === nicheFilter)
    : CHAMPION_PRODUCTS;

  const product = CHAMPION_PRODUCTS.find(p => p.id === selectedProduct);

  if (product) {
    return <ProductDetail product={product} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Discover winning products powered by AI</p>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "champions", label: "Champion Products", icon: Crown },
          { id: "ads", label: "Ads Filter", icon: Tv },
          { id: "trending", label: "Trending Products", icon: TrendingUp },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${subTab === t.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {(subTab === "champions" || subTab === "trending") && (
        <div className="flex gap-2 items-center flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          <select value={nicheFilter} onChange={e => setNicheFilter(e.target.value)} className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm">
            <option value="">All Niches</option>
            {NICHES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>
      )}

      {/* Champions */}
      {(subTab === "champions" || subTab === "trending") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p.id)} />
          ))}
        </div>
      )}

      {/* Ads */}
      {subTab === "ads" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRENDING_ADS.map(ad => (
            <div key={ad.id} className="glass-card p-4 space-y-3 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <Tv size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-medium">{ad.product}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted rounded px-2 py-1"><span className="text-muted-foreground">Views:</span> {ad.views}</div>
                <div className="bg-muted rounded px-2 py-1"><span className="text-muted-foreground">Likes:</span> {ad.likes}</div>
                <div className="bg-muted rounded px-2 py-1"><span className="text-muted-foreground">Comments:</span> {ad.comments}</div>
                <div className="bg-muted rounded px-2 py-1"><span className="text-muted-foreground">Duration:</span> {ad.duration}</div>
              </div>
              <span className="text-xs text-primary">{ad.platform}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceSection;
