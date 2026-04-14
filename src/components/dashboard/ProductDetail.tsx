import { useState, useMemo } from "react";
import { CHAMPION_PRODUCTS, generateTrendData, generateAIProductPage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Sparkles, TrendingUp, Users, CheckCircle, ExternalLink, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Product = (typeof CHAMPION_PRODUCTS)[0];

const TREND_CONFIG = {
  hot: { label: "🔥 Hot", className: "bg-red-500/20 text-red-400" },
  rising: { label: "📈 Rising", className: "bg-green-500/20 text-green-400" },
  stable: { label: "📊 Stable", className: "bg-blue-500/20 text-blue-400" },
} as const;

const ProductDetail = ({ product, onBack }: { product: Product; onBack: () => void }) => {
  const [saved, setSaved] = useState(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("zyvo_saved") || "[]");
      return existing.some((p: Product) => p.id === product.id);
    } catch {
      return false;
    }
  });

  const trendData = useMemo(() => generateTrendData(), [product.id]);
  const aiPage = useMemo(() => generateAIProductPage(product), [product.id]);
  const trend = TREND_CONFIG[product.trendLevel as keyof typeof TREND_CONFIG];

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("zyvo_saved") || "[]");
      if (!existing.find((p: Product) => p.id === product.id)) {
        localStorage.setItem("zyvo_saved", JSON.stringify([...existing, product]));
      }
      setSaved(true);
      toast.success("Product saved to Safe Place!", {
        action: { label: "View Saved", onClick: () => (window.location.href = "/dashboard/safe-place") },
      });
    } catch {
      toast.error("Could not save product. Please try again.");
    }
  };

  const profit = (product.sellPrice - product.price).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      {/* Hero grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="glass-card overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-[3/2] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";
            }}
          />
        </div>

        {/* Info */}
        <div className="space-y-4">
          {/* Title + trend badge */}
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="font-display text-3xl font-bold flex-1">{product.name}</h1>
            {trend && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium mt-1 ${trend.className}`}>
                {trend.label}
              </span>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Buy Price", value: `$${product.price}`, color: "" },
              { label: "Sell Price", value: `$${product.sellPrice}`, color: "text-green-400" },
              { label: "Profit/Unit", value: `$${profit}`, color: "text-green-400" },
              { label: "Profit Margin", value: product.profitMargin, color: "gradient-text" },
              { label: "Orders/mo", value: product.orders, color: "" },
              { label: "Source", value: product.source, color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</p>
                <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Target Audience */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={15} className="text-primary" />
              <span className="font-medium text-sm">Target Audience</span>
            </div>
            <p className="text-sm text-muted-foreground">{product.targetAudience}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saved}
              className="flex-1 gradient-bg text-primary-foreground glow-shadow hover:opacity-90"
            >
              <Bookmark size={16} className="mr-2" />
              {saved ? "Saved to Safe Place!" : "Import Champion"}
            </Button>
            {saved && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/safe-place")}
                className="shrink-0"
              >
                <ExternalLink size={15} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="glass-card p-5">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-400" /> Product Benefits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.benefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
              {benefit}
            </div>
          ))}
        </div>
      </div>

      {/* AI Marketing Copy */}
      <div className="glass-card p-5 border-primary/20">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <Zap size={16} className="text-primary" /> AI Marketing Copy
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Headline</p>
            <p className="font-semibold text-sm">{aiPage.headline}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Call to Action</p>
            <p className="text-sm text-primary font-medium">{aiPage.cta}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Urgency</p>
            <p className="text-sm text-orange-400">{aiPage.urgency}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Order Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <Tooltip
                contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="orders" stroke="hsl(264,100%,59%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-secondary" /> Engagement
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(0,0%,40%)" />
              <Tooltip
                contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="engagement" stroke="hsl(195,100%,50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
