import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CHAMPION_PRODUCTS } from "@/lib/mock-data";

const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

type FavoriteProduct = {
  id: string;
  favoriteId: string;
  name: string;
  image: string;
  price: number;
  sellPrice: number;
  niche: string;
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/user_favorites?user_id=eq.${user.id}&select=id,product_id`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        setFavorites([]);
        return;
      }

      const mapped: FavoriteProduct[] = data
        .map((fav: { id: string; product_id: number }) => {
          const product = CHAMPION_PRODUCTS.find((p) => Number(p.id) === fav.product_id);
          if (!product) return null;
          return {
            id: product.id,
            favoriteId: fav.id,
            name: product.name,
            image: product.image,
            price: product.price,
            sellPrice: product.sellPrice,
            niche: product.niche,
          };
        })
        .filter(Boolean) as FavoriteProduct[];

      setFavorites(mapped);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
      toast.error("Erro ao carregar favoritos");
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(favoriteId: string) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/user_favorites?id=eq.${favoriteId}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      setFavorites((prev) => prev.filter((f) => f.favoriteId !== favoriteId));
      toast.success("Removido dos favoritos");
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      toast.error("Erro ao remover favorito");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="text-primary fill-primary" size={28} />
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <span className="text-sm text-muted-foreground">({favorites.length})</span>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
          <p className="text-muted-foreground">
            Explore o marketplace e clique no coração para salvar produtos aqui.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((product) => (
            <Card key={product.favoriteId} className="overflow-hidden group">
              <div className="aspect-[3/2] bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x300/667EEA/FFFFFF?text=Produto";
                  }}
                />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Venda</p>
                    <p className="text-lg font-bold text-primary">${product.sellPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Custo</p>
                    <p className="text-sm font-semibold">${product.price}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <ShoppingCart size={14} className="mr-1" />
                    Carrinho
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFavorite(product.favoriteId)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
