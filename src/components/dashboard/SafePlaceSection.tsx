import { useState, useEffect } from "react";
import { CHAMPION_PRODUCTS, generateAIProductPage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Bookmark, Sparkles, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Product = typeof CHAMPION_PRODUCTS[0];

const SafePlaceSection = () => {
  const [saved, setSaved] = useState<Product[]>([]);
  const [aiPage, setAiPage] = useState<ReturnType<typeof generateAIProductPage> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("zyvo_saved") || "[]");
    setSaved(data);
  }, []);

  const remove = (id: string) => {
    const updated = saved.filter(p => p.id !== id);
    setSaved(updated);
    localStorage.setItem("zyvo_saved", JSON.stringify(updated));
    toast.success("Product removed");
  };

  const generatePage = (product: Product) => {
    setGenerating(true);
    setActiveProduct(product);
    setTimeout(() => {
      setAiPage(generateAIProductPage(product));
      setGenerating(false);
      toast.success("AI Product Page generated!");
    }, 2000);
  };

  if (aiPage && activeProduct) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button onClick={() => { setAiPage(null); setActiveProduct(null); }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
          <ArrowLeft size={16} /> Back to Safe Place
        </button>

        <div className="glass-card p-6 md:p-10 space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs gradient-bg text-primary-foreground px-3 py-1 rounded-full font-medium">{aiPage.urgency}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-4">{aiPage.headline}</h1>
            <p className="text-muted-foreground text-lg">{aiPage.description}</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-3">✅ Benefits</h2>
            <ul className="space-y-2">
              {aiPage.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground"><span className="text-green-400 mt-1">✓</span> {b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-3">🤔 Common Concerns</h2>
            {aiPage.objections.map((o, i) => (
              <div key={i} className="glass-card p-4 mb-3">
                <p className="font-medium text-sm">{o.q}</p>
                <p className="text-muted-foreground text-sm mt-1">{o.a}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-3">❓ FAQ</h2>
            {aiPage.faq.map((f, i) => (
              <div key={i} className="glass-card p-4 mb-3">
                <p className="font-medium text-sm">{f.q}</p>
                <p className="text-muted-foreground text-sm mt-1">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button className="gradient-bg text-primary-foreground text-lg px-8 py-6 glow-shadow hover:opacity-90 animate-pulse-glow">
              {aiPage.cta}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2"><Bookmark size={28} className="text-primary" /> Safe Place</h1>
        <p className="text-muted-foreground">Your saved products and AI page generator</p>
      </div>

      {saved.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <Bookmark size={48} className="mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No saved products yet. Import champions from the Marketplace!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(p => (
            <div key={p.id} className="glass-card overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full aspect-[4/3] object-cover" />
              <div className="p-4 space-y-3">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-green-400">Profit: {p.profitMargin}</p>
                <div className="flex gap-2">
                  <Button onClick={() => generatePage(p)} disabled={generating} className="flex-1 gradient-bg text-primary-foreground text-xs hover:opacity-90" size="sm">
                    <Sparkles size={14} className="mr-1" /> {generating ? "Generating..." : "Generate AI Page"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => remove(p.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafePlaceSection;
