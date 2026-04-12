import { useState } from "react";
import { CHAMPION_PRODUCTS, generateTrendData, generateAIProductPage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Sparkles, TrendingUp, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Product = typeof CHAMPION_PRODUCTS[0];

const ProductDetail = ({ product, onBack }: { product: Product; onBack: () => void }) => {
  const [saved, setSaved] = useState(false);
  const trendData = generateTrendData();

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem("zyvo_saved") || "[]");
    if (!existing.find((p: Product) => p.id === product.id)) {
      localStorage.setItem("zyvo_saved", JSON.stringify([...existing, product]));
    }
    setSaved(true);
    toast.success("Product saved to Safe Place!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Buy Price</p>
              <p className="font-bold text-lg">${product.price}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Sell Price</p>
              <p className="font-bold text-lg text-green-400">${product.sellPrice}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Profit Margin</p>
              <p className="font-bold text-lg gradient-text">{product.profitMargin}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Orders/mo</p>
              <p className="font-bold text-lg">{product.orders}</p>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2"><Users size={16} className="text-primary" /><span className="font-medium text-sm">Target Audience</span></div>
            <p className="text-sm text-muted-foreground">{product.targetAudience}</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saved} className="flex-1 gradient-bg text-primary-foreground glow-shadow hover:opacity-90">
              <Bookmark size={16} className="mr-2" /> {saved ? "Saved!" : "Import Champion"}
            </Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Order Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(264,100%,59%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Sparkles size={16} className="text-secondary" /> Engagement</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="engagement" stroke="hsl(195,100%,50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
