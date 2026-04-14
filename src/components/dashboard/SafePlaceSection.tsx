import { useState, useEffect } from "react";
import { CHAMPION_PRODUCTS, generateAIProductPage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Bookmark, Sparkles, Trash2, ArrowLeft, Copy, CheckCheck, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Product = (typeof CHAMPION_PRODUCTS)[0];
type AIPage = ReturnType<typeof generateAIProductPage>;

// ─── Confirm Delete Dialog ─────────────────────────────────────────────────────
const ConfirmDelete = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 max-w-sm mx-4 space-y-4"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="text-orange-400 shrink-0" />
        <p className="font-semibold">Remove this product?</p>
      </div>
      <p className="text-sm text-muted-foreground">
        This product will be removed from your Safe Place. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1 bg-red-500/80 hover:bg-red-500 text-white border-0" onClick={onConfirm}>
          Remove
        </Button>
      </div>
    </motion.div>
  </div>
);

// ─── Copy Button ───────────────────────────────────────────────────────────────
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please try manually.");
    }
  };
  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 text-xs">
      {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

// ─── AI Page View ──────────────────────────────────────────────────────────────
const AIPageView = ({ aiPage, product, onBack }: { aiPage: AIPage; product: Product; onBack: () => void }) => {
  const fullText = [
    aiPage.headline,
    "",
    aiPage.description,
    "",
    "BENEFITS:",
    ...aiPage.benefits.map((b) => `✓ ${b}`),
    "",
    "COMMON CONCERNS:",
    ...aiPage.objections.map((o) => `Q: ${o.q}\nA: ${o.a}`),
    "",
    "FAQ:",
    ...aiPage.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`),
    "",
    aiPage.cta,
    aiPage.urgency,
  ].join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Safe Place
        </button>
        <CopyButton text={fullText} />
      </div>

      <div className="glass-card p-6 md:p-10 space-y-8 max-w-3xl mx-auto">
        {/* Product image */}
        <div className="aspect-[3/2] rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";
            }}
          />
        </div>

        {/* Hero */}
        <div className="text-center space-y-3">
          <span className="text-xs gradient-bg text-primary-foreground px-3 py-1 rounded-full font-medium">
            {aiPage.urgency}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-4">{aiPage.headline}</h1>
          <p className="text-muted-foreground text-lg">{aiPage.description}</p>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="font-display text-xl font-bold mb-3">✅ Benefits</h2>
          <ul className="space-y-2">
            {aiPage.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-400 mt-1">✓</span> {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Objections */}
        <div>
          <h2 className="font-display text-xl font-bold mb-3">🤔 Common Concerns</h2>
          <div className="space-y-3">
            {aiPage.objections.map((o) => (
              <div key={o.q} className="glass-card p-4">
                <p className="font-medium text-sm">{o.q}</p>
                <p className="text-muted-foreground text-sm mt-1">{o.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-xl font-bold mb-3">❓ FAQ</h2>
          <div className="space-y-3">
            {aiPage.faq.map((f) => (
              <div key={f.q} className="glass-card p-4">
                <p className="font-medium text-sm">{f.q}</p>
                <p className="text-muted-foreground text-sm mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="gradient-bg text-primary-foreground text-lg px-8 py-6 glow-shadow hover:opacity-90">
            {aiPage.cta}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const SafePlaceSection = () => {
  const [saved, setSaved] = useState<Product[]>([]);
  const [aiPage, setAiPage] = useState<AIPage | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("zyvo_saved") || "[]");
      setSaved(data);
    } catch {
      setSaved([]);
    }
  }, []);

  const remove = (id: string) => {
    try {
      const updated = saved.filter((p) => p.id !== id);
      setSaved(updated);
      localStorage.setItem("zyvo_saved", JSON.stringify(updated));
      toast.success("Product removed from Safe Place");
    } catch {
      toast.error("Could not remove product. Please try again.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const generatePage = (product: Product) => {
    setGeneratingId(product.id);
    setActiveProduct(product);
    setTimeout(() => {
      setAiPage(generateAIProductPage(product));
      setGeneratingId(null);
      toast.success("AI Product Page generated!");
    }, 2000);
  };

  if (aiPage && activeProduct) {
    return (
      <AIPageView
        aiPage={aiPage}
        product={activeProduct}
        onBack={() => {
          setAiPage(null);
          setActiveProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirm delete modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <ConfirmDelete onConfirm={() => remove(confirmDeleteId)} onCancel={() => setConfirmDeleteId(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Bookmark size={28} className="text-primary" /> Safe Place
        </h1>
        <p className="text-muted-foreground">Your saved products and AI page generator</p>
      </div>

      {/* Empty state */}
      {saved.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <Bookmark size={48} className="mx-auto text-muted-foreground/40" />
          <p className="font-semibold">No saved products yet</p>
          <p className="text-muted-foreground text-sm">Import champions from the Marketplace to see them here!</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {saved.length} product{saved.length !== 1 ? "s" : ""} saved
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full aspect-[3/2] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";
                  }}
                />
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400 font-medium">{p.profitMargin} margin</span>
                    <span className="text-muted-foreground">${p.sellPrice} sell</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => generatePage(p)}
                      disabled={generatingId !== null}
                      className="flex-1 gradient-bg text-primary-foreground text-xs hover:opacity-90"
                      size="sm"
                    >
                      <Sparkles size={14} className="mr-1" />
                      {generatingId === p.id ? "Generating..." : "Generate AI Page"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(p.id)}
                      className="hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SafePlaceSection;
