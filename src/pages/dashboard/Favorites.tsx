import { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/dashboard/ProductCard";
import ProductDetail from "@/components/dashboard/ProductDetail";

const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async function fetchFavorites() {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Buscar IDs dos produtos favoritados
      const favResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_favorites?user_id=eq.${user.id}&select=product_id`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
      );
      const favData = await favResponse.json();

      if (favData && favData.length > 0) {
        const productIds = favData.map((item: any) => item.product_id).join(",");

        // Buscar detalhes dos produtos favoritados
        const productsResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?id=in.(${productIds})&select=*`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const productsData = await productsResponse.json();

        // Formatar produtos
        const formattedProducts = productsData.map((p: any) => ({
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

        setFavoriteProducts(formattedProducts);
      } else {
        setFavoriteProducts([]);
      }
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Função para remover produto da lista localmente (quando desfavoritar)
  const removeFromFavorites = (productId: string) => {
    console.log("Removendo da lista:", productId);
    setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const product = favoriteProducts.find((p) => p.id === selectedProduct);

  if (product) {
    return <ProductDetail product={product} onBack={() => setSelectedProduct(null)} />;
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/marketplace")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Marketplace
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart size={28} className="fill-red-500 text-red-500" />
          My Favorites
        </h1>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={60} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">You don't have any favorite products yet</p>
          <button
            onClick={() => navigate("/dashboard/marketplace")}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">{favoriteProducts.length} favorite product(s)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product.id)}
                onFavoriteRemoved={() => removeFromFavorites(product.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
