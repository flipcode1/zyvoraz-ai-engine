import { useState } from "react";
import { CHAMPION_PRODUCTS, TRENDING_ADS, NICHES, COUNTRIES } from "@/lib/mock-data";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { Crown, Filter, TrendingUp, Tv, PackageSearch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SubTab = "champions" | "ads" | "trending";

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
    <PackageSearch size={40} className="text-muted-foreground/40" />
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);

// ─── Champions Tab ─────────────────────────────────────────────────────────────
const ChampionsTab = ({
  nicheFilter,
  countryFilter,
  onSelect,
}: {
  nicheFilter: string;
  countryFilter: string;
  onSelect: (id: string) => void;
}) => {
  const filtered = CHAMPION_PRODUCTS.filter((p) => {
    const matchNiche = nicheFilter ? p.niche === nicheFilter : true;
    const matchCountry = countryFilter ? p.country === countryFilter : true;
    return matchNiche && matchCountry;
  });

  if (filtered.length === 0) return <EmptyState message="No products found for the selected filters." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
};

// ─── Trending Tab ──────────────────────────────────────────────────────────────
const TrendingTab = ({
  nicheFilter,
  countryFilter,
  onSelect,
}: {
  nicheFilter: string;
  countryFilter: string;
  onSelect: (id: string) => void;
}) => {
  const TRENDING_PRODUCTS = [...CHAMPION_PRODUCTS].sort((a, b) => (b.trend ?? 0) - (a.trend ?? 0)).slice(0, 12);

  const filtered = TRENDING_PRODUCTS.filter((p) => {
    const matchNiche = nicheFilter ? p.niche === nicheFilter : true;
    const matchCountry = countryFilter ? p.country === countryFilter : true;
    return matchNiche && matchCountry;
  });

  if (filtered.length === 0) return <EmptyState message="No trending products found for the selected filters." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
};

// ─── Ads Tab ───────────────────────────────────────────────────────────────────
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
            <div className="bg-muted rounded px-2 py-1.5">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wide mb-0.5">Views</span>
              <span className="font-medium">{ad.views}</span>
            </div>
            <div className="bg-muted rounded px-2 py-1.5">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wide mb-0.5">Likes</span>
              <span className="font-medium">{ad.likes}</span>
            </div>
            <div className="bg-muted rounded px-2 py-1.5">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wide mb-0.5">Comments</span>
              <span className="font-medium">{ad.comments}</span>
            </div>
            <div className="bg-muted rounded px-2 py-1.5">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wide mb-0.5">Duration</span>
              <span className="font-medium">{ad.duration}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const MarketplaceSection = () => {
  const [subTab, setSubTab] = useState<SubTab>("champions");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const handleTabChange = (tab: SubTab) => {
    setSubTab(tab);
    setNicheFilter("");
    setCountryFilter("");
  };

  const product = CHAMPION_PRODUCTS.find((p) => p.id === selectedProduct);
  if (product) {
    return <ProductDetail product={product} onBack={() => setSelectedProduct(null)} />;
  }

  const showFilters = subTab === "champions" || subTab === "trending";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Discover winning products powered by AI</p>
      </div>

      {/* Sub Tabs */}
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

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-3 items-center flex-wrap">
          <Filter size={14} className="text-muted-foreground" />

          <Select value={nicheFilter} onValueChange={setNicheFilter}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="All Niches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Niches</SelectItem>
              {NICHES.map((n) => (
                <SelectItem key={n.id} value={n.id}>
                  {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(nicheFilter || countryFilter) && (
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

      {/* Tab Content */}
      {subTab === "champions" && (
        <ChampionsTab nicheFilter={nicheFilter} countryFilter={countryFilter} onSelect={setSelectedProduct} />
      )}
      {subTab === "trending" && (
        <TrendingTab nicheFilter={nicheFilter} countryFilter={countryFilter} onSelect={setSelectedProduct} />
      )}
      {subTab === "ads" && <AdsTab />}
    </div>
  );
};

export default MarketplaceSection;
