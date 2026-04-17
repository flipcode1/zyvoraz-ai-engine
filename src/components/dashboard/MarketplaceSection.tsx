import { useState, useEffect } from "react";
import { CHAMPION_PRODUCTS, TRENDING_ADS, NICHES, COUNTRIES } from "@/lib/mock-data";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { Crown, Filter, TrendingUp, Tv, PackageSearch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client"; // 👈 NOVO

type SubTab = "champions" | "ads" | "trending";

const TREND_ORDER: Record<string, number> = { hot: 3, rising: 2, stable: 1 };

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
    <PackageSearch size={40} className="text-muted-foreground/40" />
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);

// 👇 NOVO: Componente ChampionsTab adaptado para Supabase
const ChampionsTab = ({
  nicheFilter,
  onSelect,
  products,
}: {
  nicheFilter: string;
  onSelect: (id: string) => void;
  products: any[];
}) => {
  const filtered = products.filter((p) => (nicheFilter ? p.niche === nicheFilter : true));
  if (filtered.length === 0) return <EmptyState message="No products found for the selected niche." />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
};

// 👇 NOVO: TrendingTab adaptado para Supabase
const TrendingTab = ({
  nicheFilter,
  onSelect,
  products,
}: {
  nicheFilter: string;
  onSelect: (id: string) => void;
  products: any[];
}) => {
  const trending = [...products].sort((a, b) => (TREND_ORDER[b.trendLevel] ?? 0) - (TREND_ORDER[a.trendLevel] ?? 0));
  const filtered = trending.filter((p) => (nicheFilter ? p.niche === nicheFilter : true));
  if (filtered.length === 0) return <EmptyState message="No trending products found for the selected niche." />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
};

// AdsTab permanece IGUAL (por enquanto)
const AdsTab = () => {
  if (TRENDING_ADS.length === 0) return <EmptyState message="No ads available right now." />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TRENDING_ADS.map((ad) => (
        <div
          key={ad.id}
          className="glass-card p-4 space-y-3 hover:border-primary/30 transition-colors cursor-pointer group"
        >
          <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <Tv size={28} className="text-muted-foreground/60 relative z-10" />
            <span className="text-[10px] text-muted-foreground relative z-10 uppercase tracking-wider">
              {ad.platform}
            </span>
          </div>
          <h3 className="font-medium text-sm leading-snug">{ad.product}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Views", value: ad.views },
              { label: "Likes", value: ad.likes },
              { label: "Comments", value: ad.comments },
              { label: "Duration", value: ad.duration },
            ].map((stat) => (
              <div key={stat.label} className="bg-muted rounded px-2 py-1.5">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wide mb-0.5">
                  {stat.label}
                </span>
                <span className="font-medium">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// 👇 COMPONENTE PRINCIPAL - MUITAS MUDANÇAS AQUI
const MarketplaceSection = () => {
  const [subTab, setSubTab] = useState<SubTab>("champions");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]); // 👈 NOVO: produtos vindos do Supabase

  // 👇 NOVO: Buscar produtos do Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        // Fallback: usar dados mockados se der erro
        setProducts(CHAMPION_PRODUCTS);
      } else if (data && data.length > 0) {
        // Converter produtos do Supabase para o formato esperado pelo ProductCard
        const formattedProducts = data.map((p) => ({
          id: String(p.id),
          name: p.title,
          price: p.price,
          image: p.image_url,
          niche: p.category || "general",
          trendLevel: "stable", // valor padrão
          sales: 0,
          revenue: 0,
          profit: 0,
          roi: 0,
          // manter campos originais para compatibilidade
          ...p,
        }));
        setProducts(formattedProducts);
      } else {
        // Se não há produtos no Supabase, usar mockados
        setProducts(CHAMPION_PRODUCTS);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const handleTabChange = (tab: SubTab) => {
    setSubTab(tab);
    setNicheFilter("");
    setCountryFilter("");
  };

  // 👇 IMPORTANTE: Buscar o produto selecionado nos produtos carregados
  const product = products.find((p) => p.id === selectedProduct);

  if (product) {
    return <ProductDetail product={product} onBack={() => setSelectedProduct(null)} />;
  }

  const showFilters = subTab === "champions" || subTab === "trending";
  const hasActiveFilter = nicheFilter || countryFilter;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
        <div className="h-10 bg-muted rounded animate-pulse w-1/4"></div>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 bg-muted rounded animate-pulse w-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Discover winning products powered by AI</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(
          [
            { id: "champions", label: "Champion Products", icon: Crown },
            { id: "ads", label: "Ads Filter", icon: Tv },
            { id: "trending", label: "Trending Products", icon: TrendingUp },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              subTab === t.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="flex gap-3 items-center flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          <Select value={nicheFilter || "all"} onValueChange={(v) => setNicheFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="All Niches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Niches</SelectItem>
              {NICHES.map((n) => (
                <SelectItem key={n.id} value={n.id}>
                  {n.icon} {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={countryFilter || "all"} onValueChange={(v) => setCountryFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilter && (
            <button
              onClick={() => {
                setNicheFilter("");
                setCountryFilter("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {subTab === "champions" && (
        <ChampionsTab
          nicheFilter={nicheFilter}
          onSelect={setSelectedProduct}
          products={products} // 👈 PASSA OS PRODUTOS DO SUPABASE
        />
      )}

      {subTab === "trending" && (
        <TrendingTab
          nicheFilter={nicheFilter}
          onSelect={setSelectedProduct}
          products={products} // 👈 PASSA OS PRODUTOS DO SUPABASE
        />
      )}

      {subTab === "ads" && <AdsTab />}
    </div>
  );
};

export default MarketplaceSection;
