import { CHAMPION_PRODUCTS, NICHES } from "@/lib/mock-data";
import { TrendingUp, ShoppingCart, DollarSign } from "lucide-react";

type Product = (typeof CHAMPION_PRODUCTS)[0];

const TREND_CONFIG = {
  hot: { label: "🔥 Hot", className: "bg-red-500/20 text-red-400" },
  rising: { label: "📈 Rising", className: "bg-green-500/20 text-green-400" },
  stable: { label: "📊 Stable", className: "bg-blue-500/20 text-blue-400" },
} as const;

const getNicheName = (nicheId: string) => NICHES.find((n) => n.id === nicheId)?.name ?? nicheId;

const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const trend = TREND_CONFIG[product.trendLevel as keyof typeof TREND_CONFIG] ?? {
    label: product.trendLevel,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <button
      onClick={onClick}
      className="glass-card overflow-hidden text-left transition-all hover:border-primary/40 hover:glow-shadow group w-full"
    >
      {/* Image */}
      <div className="aspect-[3/2] bg-muted overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";
          }}
        />
        {/* Sell price badge over image */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
          ${product.sellPrice}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${trend.className}`}>
            <TrendingUp size={10} />
            {trend.label}
          </span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{product.source}</span>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {getNicheName(product.niche)}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Profit</p>
            <p className="text-sm font-semibold text-green-400">{product.profitMargin}</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Cost</p>
            <p className="text-sm font-semibold">${product.price}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Orders</p>
            <p className="text-sm font-semibold flex items-center justify-center gap-0.5">
              <ShoppingCart size={11} className="text-muted-foreground" />
              {product.orders}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
