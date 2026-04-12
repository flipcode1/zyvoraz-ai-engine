import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ZyvorazLogo from "@/components/ZyvorazLogo";
import MarketplaceSection from "@/components/dashboard/MarketplaceSection";
import SafePlaceSection from "@/components/dashboard/SafePlaceSection";
import AIToolsSection from "@/components/dashboard/AIToolsSection";
import { ShoppingBag, Bookmark, Sparkles, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TABS = [
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "safeplace", label: "Safe Place", icon: Bookmark },
  { id: "aitools", label: "AI Tools", icon: Sparkles },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <ZyvorazLogo size="sm" />
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "gradient-bg text-primary-foreground glow-shadow" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut size={16} className="mr-1" /> Logout
          </Button>
          <button className="md:hidden text-muted-foreground" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden border-b border-border p-3 flex gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setMobileMenu(false); }} className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium ${activeTab === t.id ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === "marketplace" && <MarketplaceSection />}
          {activeTab === "safeplace" && <SafePlaceSection />}
          {activeTab === "aitools" && <AIToolsSection />}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
