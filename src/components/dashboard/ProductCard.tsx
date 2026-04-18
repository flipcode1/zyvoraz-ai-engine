import { CHAMPION_PRODUCTS, NICHES } from "@/lib/mock-data";
import { TrendingUp, ShoppingCart, DollarSign, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type Product = (typeof CHAMPION_PRODUCTS)[0];

const TREND_CONFIG = {
  hot: { label: "🔥 Hot", className: "bg-red-500/20 text-red-400" },
  rising: { label: "📈 Rising", className: "bg-green-500/20 text-green-400" },
  stable: { label: "📊 Stable", className: "bg-blue-500/20 text-blue-400" },
} as const;

const getNicheName = (nicheId: string) => NICHES.find((n) => n.id === nicheId)?.name ?? nicheId;

// URLs do Supabase
const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const trend = TREND_CONFIG[product.trendLevel as keyof typeof TREND_CONFIG] ?? {
    label: product.trendLevel,
    className: "bg-muted text-muted-foreground",
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar se o produto está nos favoritos ao carregar
  useEffect(() => {
    checkIfFavorite();
  }, [product.id]);

  async function getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async function checkIfFavorite() {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      console.log("Verificando favorito para produto:", product.id, "usuário:", user.id);

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/user_favorites?user_id=eq.${user.id}&product_id=eq.${product.id}&select=id`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
      );

      const data = await response.json();
      console.log("Resultado da busca:", data);
      setIsFavorite(data && data.length > 0);
    } catch (err) {
      console.error("Erro ao verificar favorito:", err);
    }
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    const user = await getCurrentUser();
    if (!user) {
      alert("Faça login para favoritar produtos");
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        // Remover dos favoritos
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/user_favorites?user_id=eq.${user.id}&product_id=eq.${product.id}`,
          {
            method: "DELETE",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (response.ok) {
          setIsFavorite(false);
          console.log("Favorito removido");
        } else {
          console.error("Erro ao remover:", await response.text());
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_favorites`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: Number(product.id),
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
          console.log("Favorito adicionado");
        } else {
          const error = await response.text();
          console.error("Erro ao adicionar:", error);
          alert("Erro ao salvar favorito. Tente novamente.");
        }
      }
    } catch (err) {
      console.error("Erro ao favoritar:", err);
      alert("Erro ao salvar favorito. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="glass-card overflow-hidden text-left transition-all hover:border-primary/40 hover:glow-shadow group w-full relative"
    >
      {/* Botão de Favorito */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm rounded-full p-1.5 hover:bg-black/80 transition-all"
      >
        <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-white"} />
      </button>

      {/* Image */}
      <div className="aspect-[3/2] bg-muted overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x300/667EEA/FFFFFF?text=Produto";
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
        <h3 className="font-semibold line-clamp-2 min-w-0">{product.name}</h3>

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
    </div>
  );
};

export default ProductCard;
