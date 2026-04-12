import { CHAMPION_PRODUCTS } from "@/lib/mock-data";
import { TrendingUp, ShoppingCart } from "lucide-react";

type Product = typeof CHAMPION_PRODUCTS[0];

const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => (
  <button onClick={onClick} className="glass-card overflow-hidden text-left transition-all hover:border-primary/40 hover:glow-shadow group">
    <div className="aspect-[4/3] bg-muted overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-4 space-y-3">
      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full ${product.trendLevel === "hot" ? "bg-red-500/20 text-red-400" : product.trendLevel === "rising" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
          <TrendingUp size={10} className="inline mr-1" />{product.trendLevel}
        </span>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{product.source}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Profit: <span className="text-green-400 font-medium">{product.profitMargin}</span></span>
        <span className="text-muted-foreground flex items-center gap-1"><ShoppingCart size={12} /> {product.orders}</span>
      </div>
    </div>
  </button>
);

export default ProductCard;
