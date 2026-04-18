import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  async function getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async function fetchCart() {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Buscar itens do carrinho
      const cartResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_cart?user_id=eq.${user.id}&select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      const cartData = await cartResponse.json();
      setCartItems(cartData);

      // Buscar detalhes dos produtos
      if (cartData.length > 0) {
        const productIds = cartData.map((item: any) => item.product_id).join(",");
        const productsResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?id=in.(${productIds})&select=*`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(productId: number) {
    const user = await getCurrentUser();
    if (!user) return;

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/user_cart?user_id=eq.${user.id}&product_id=eq.${productId}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      fetchCart(); // Recarrega o carrinho
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  }

  async function updateQuantity(productId: number, newQuantity: number) {
    if (newQuantity < 1) return;

    const user = await getCurrentUser();
    if (!user) return;

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/user_cart?user_id=eq.${user.id}&product_id=eq.${productId}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      fetchCart(); // Recarrega o carrinho
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    }
  }

  // Calcular total
  const total = products.reduce((sum, product) => {
    const cartItem = cartItems.find((item) => item.product_id === product.id);
    const quantity = cartItem?.quantity || 1;
    return sum + product.price * quantity;
  }, 0);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Carregando carrinho...</div>
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
          Voltar às compras
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart size={28} className="text-primary" />
          Meu Carrinho
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={60} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
          <button
            onClick={() => navigate("/dashboard/marketplace")}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Continuar comprando
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de produtos */}
          <div className="lg:col-span-2 space-y-4">
            {products.map((product) => {
              const cartItem = cartItems.find((item) => item.product_id === product.id);
              const quantity = cartItem?.quantity || 1;

              return (
                <div key={product.id} className="glass-card p-4 flex gap-4">
                  <img
                    src={product.image_url || "https://placehold.co/100x100"}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-green-600 font-bold">€{product.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="bg-muted px-2 py-1 rounded hover:bg-muted/80"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="bg-muted px-2 py-1 rounded hover:bg-muted/80"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">€{(product.price * quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo do pedido */}
          <div className="glass-card p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">€{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => alert("Funcionalidade de checkout em desenvolvimento!")}
              className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
