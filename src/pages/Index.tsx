import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ZyvorazLogo from "@/components/ZyvorazLogo";
import { ArrowRight, Zap, Globe, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "AI-Powered Discovery", desc: "Find winning products with our intelligent algorithms" },
  { icon: Globe, title: "Global Markets", desc: "Sell to 10+ countries with localized strategies" },
  { icon: TrendingUp, title: "Trend Analysis", desc: "Stay ahead with real-time trend monitoring" },
  { icon: Shield, title: "Safe & Reliable", desc: "Tested products with proven profit margins" },
];

const Index = () => (
  <div className="min-h-screen">
    {/* Nav */}
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <ZyvorazLogo />
      <div className="flex gap-3">
        <Link to="/login"><Button variant="ghost" className="text-muted-foreground">Log In</Button></Link>
        <Link to="/signup"><Button className="gradient-bg text-primary-foreground glow-shadow hover:opacity-90">Get Started</Button></Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[150px]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 space-y-6">
        <span className="inline-block gradient-bg text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">AI-Powered Dropshipping</span>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
          <span className="gradient-text">Automate.</span> <span className="gradient-text">Scale.</span>{" "}
          <span className="gradient-text">Profit.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Turn ideas into income with the world's smartest dropshipping platform. Discover winning products, build stores, and scale globally — all powered by AI.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="gradient-bg text-primary-foreground text-lg px-8 py-6 glow-shadow hover:opacity-90 animate-pulse-glow">
              Start Free <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 space-y-3 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
              <f.icon size={22} className="text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border py-8 text-center">
      <p className="text-muted-foreground text-sm">© 2026 Zyvoraz. All rights reserved. Your Global Selling Engine.</p>
    </footer>
  </div>
);

export default Index;
