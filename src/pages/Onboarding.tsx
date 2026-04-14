import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ZyvorazLogo from "@/components/ZyvorazLogo";
import { COUNTRIES, NICHES, getBannersForNiche } from "@/lib/mock-data";
import { Check, ChevronLeft, ChevronRight, ExternalLink, Globe, Sparkles, Image, Store, Link2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = ["Country", "Niche", "Banners", "Shopify Account", "Connect Store", "Final Setup"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState(profile?.country || "");
  const [niche, setNiche] = useState(profile?.niche || "");
  const [selectedBanners, setSelectedBanners] = useState<string[]>(profile?.selected_banners || []);
  const [bannerPage, setBannerPage] = useState(0);
  const [shopifyConfirmed, setShopifyConfirmed] = useState(false);
  const [storeUrl, setStoreUrl] = useState(profile?.store_url || "");
  const [finalConfirmed, setFinalConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect if already completed
  if (profile?.onboarding_completed) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const canNext = () => {
    if (step === 0) return !!country;
    if (step === 1) return !!niche;
    if (step === 2) return selectedBanners.length === 3;
    if (step === 3) return shopifyConfirmed;
    if (step === 4) return storeUrl.toLowerCase().includes("shopify.com") && storeUrl.length > 12;
    if (step === 5) return finalConfirmed;
    return false;
  };

  const saveStep = async (data: { country?: string; niche?: string; selected_banners?: string[]; store_url?: string; onboarding_completed?: boolean }) => {
    if (!user) return;
    await supabase.from("profiles").update(data).eq("user_id", user.id);
  };

  const next = async () => {
    setSaving(true);
    try {
      if (step === 0) await saveStep({ country });
      if (step === 1) await saveStep({ niche });
      if (step === 2) await saveStep({ selected_banners: selectedBanners });
      if (step === 4) await saveStep({ store_url: storeUrl });

      if (step === 5) {
        await saveStep({ onboarding_completed: true });
        await refreshProfile();
        toast.success("Setup complete! Welcome to Zyvoraz 🚀");
        navigate("/dashboard");
      } else {
        setStep((s) => s + 1);
      }
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleBanner = (id: string) => {
    setSelectedBanners((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const nicheBanners = getBannersForNiche(niche || "tech");
  const pageBanners = nicheBanners.slice(bannerPage * 6, bannerPage * 6 + 6);
  const stepIcons = [Globe, Sparkles, Image, Store, Link2, ShieldCheck];
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <ZyvorazLogo size="sm" />
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-colors ${i <= step ? "gradient-bg" : "bg-muted"}`} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{step + 1}/{STEPS.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <StepIcon size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">{STEPS[step]}</h2>
                <p className="text-muted-foreground text-sm">
                  {step === 0 && "Select your target market"}
                  {step === 1 && "Choose your product niche"}
                  {step === 2 && "Pick 3 banners for your store"}
                  {step === 3 && "Create your Shopify account"}
                  {step === 4 && "Connect your store"}
                  {step === 5 && "Final configuration"}
                </p>
              </div>
            </div>

            {/* Step 0: Country */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((c) => (
                  <button key={c.code} onClick={() => setCountry(c.code)} className={`glass-card p-4 flex items-center gap-3 text-left transition-all hover:border-primary/50 ${country === c.code ? "border-primary glow-shadow" : ""}`}>
                    <span className="text-2xl">{c.flag}</span>
                    <span className="font-medium">{c.name}</span>
                    {country === c.code && <Check size={16} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Niche */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {NICHES.map((n) => (
                  <button key={n.id} onClick={() => setNiche(n.id)} className={`glass-card p-5 flex flex-col gap-2 text-left transition-all hover:border-primary/50 ${niche === n.id ? "border-primary glow-shadow" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{n.icon}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${n.trend === "hot" ? "bg-destructive/20 text-destructive" : n.trend === "rising" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>{n.trend}</span>
                    </div>
                    <span className="font-medium">{n.name}</span>
                    {niche === n.id && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Banners */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Selected: {selectedBanners.length}/3</p>
                <div className="grid grid-cols-3 gap-3">
                  {pageBanners.map((b) => (
                    <button key={b.id} onClick={() => toggleBanner(b.id)} className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedBanners.includes(b.id) ? "border-primary glow-shadow" : "border-border hover:border-primary/30"}`}>
                      <img src={b.image} alt={b.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white bg-black/40 px-2 py-1 rounded backdrop-blur-sm">{b.category}</span>
                      </div>
                      {selectedBanners.includes(b.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                          <Check size={14} className="text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={bannerPage === 0} onClick={() => setBannerPage((p) => p - 1)}><ChevronLeft size={16} /></Button>
                  <span className="text-sm text-muted-foreground">Page {bannerPage + 1}/10</span>
                  <Button variant="outline" size="sm" disabled={bannerPage === 9} onClick={() => setBannerPage((p) => p + 1)}><ChevronRight size={16} /></Button>
                </div>
              </div>
            )}

            {/* Step 3: Shopify Account */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="glass-card p-6 space-y-4">
                  {["Go to Shopify.com and create a free account", "Choose your store name", "Select a plan (you can start with the free trial)", "Complete the basic store setup"].map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0 text-sm font-bold text-primary-foreground">{i + 1}</div>
                      <p className="text-sm pt-1">{s}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.open("https://www.shopify.com", "_blank")}>
                  <ExternalLink size={16} className="mr-2" /> Open Shopify Signup
                </Button>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={shopifyConfirmed} onChange={(e) => setShopifyConfirmed(e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm">I have created my Shopify account</span>
                </label>
              </div>
            )}

            {/* Step 4: Connect Store */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="glass-card p-6 space-y-3">
                  <p className="text-sm text-muted-foreground">Enter your Shopify store URL:</p>
                  <Input placeholder="yourstore.myshopify.com or admin.shopify.com/store/xxx" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} className="bg-muted/50" />
                  {storeUrl && !storeUrl.toLowerCase().includes("shopify.com") && (
                    <p className="text-xs text-destructive">URL must contain shopify.com</p>
                  )}
                  {storeUrl && storeUrl.toLowerCase().includes("shopify.com") && (
                    <p className="text-xs text-green-400">✓ Valid Shopify URL</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Final Setup */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-display font-bold text-lg">Remove Shopify Password Protection</h3>
                  {["Go to your Shopify Admin → Online Store → Preferences", "Scroll to 'Password protection'", "Uncheck 'Restrict access to visitors with the password'", "Click Save"].map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0 text-sm font-bold text-primary-foreground">{i + 1}</div>
                      <p className="text-sm pt-1">{s}</p>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={finalConfirmed} onChange={(e) => setFinalConfirmed(e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm">I have completed all the steps</span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft size={16} className="mr-1" /> Back
              </Button>
              <Button disabled={!canNext() || saving} onClick={next} className="gradient-bg text-primary-foreground glow-shadow hover:opacity-90">
                {saving ? "Saving..." : step === 5 ? "Launch Dashboard 🚀" : "Continue"} <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
