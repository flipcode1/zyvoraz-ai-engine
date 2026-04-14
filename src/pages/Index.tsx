import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ZyvorazLogo from "@/components/ZyvorazLogo";
import { ArrowRight, Zap, Globe, TrendingUp, Shield, Play, Star, Users, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Discovery",
    desc: "Find winning products with our intelligent algorithms before your competitors do.",
  },
  { icon: Globe, title: "Global Markets", desc: "Sell to 10+ countries with fully localized strategies and pricing." },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    desc: "Stay ahead with real-time trend monitoring and demand forecasting.",
  },
  { icon: Shield, title: "Safe & Reliable", desc: "Tested products with proven profit margins and vetted suppliers." },
];

const steps = [
  { number: "01", title: "Connect Your Store", desc: "Link your Shopify, WooCommerce, or any platform in seconds." },
  {
    number: "02",
    title: "Discover Products",
    desc: "Our AI scans millions of products and surfaces the winners for you.",
  },
  { number: "03", title: "Scale & Profit", desc: "Launch campaigns, automate fulfillment, and watch revenue grow." },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Store Owner",
    text: "Zyvoraz helped me find 3 winning products in my first week. Revenue went from $0 to $12k/month.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    role: "Dropshipper",
    text: "The AI trend analysis is insane. I spotted a viral product 2 weeks before it blew up.",
    stars: 5,
  },
  {
    name: "Lena M.",
    role: "Entrepreneur",
    text: "Best investment I've made. The global market reach alone is worth every penny.",
    stars: 5,
  },
];

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    desc: "Perfect for beginners",
    features: ["50 AI product scans/month", "3 active stores", "Basic trend alerts", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    desc: "For serious sellers",
    features: [
      "Unlimited product scans",
      "10 active stores",
      "Real-time trend alerts",
      "5 global markets",
      "Priority support",
      "AI ad copy generator",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Scale",
    price: "$199",
    period: "/mo",
    desc: "For teams & agencies",
    features: [
      "Everything in Pro",
      "Unlimited stores",
      "All 10+ markets",
      "Team collaboration",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const stats = [
  { icon: Users, value: "12,000+", label: "Active Sellers" },
  { icon: Package, value: "2M+", label: "Products Analyzed" },
  { icon: Globe, value: "10+", label: "Global Markets" },
  { icon: TrendingUp, value: "$48M+", label: "Revenue Generated" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Index = () => (
  <div className="min-h-screen">
    {/* Nav */}
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <ZyvorazLogo />
      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#how-it-works" className="hover:text-foreground transition-colors">
          How it Works
        </a>
        <a href="#pricing" className="hover:text-foreground transition-colors">
          Pricing
        </a>
      </div>
      <div className="flex gap-3">
        <Link to="/login">
          <Button variant="ghost" className="text-muted-foreground">
            Log In
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="gradient-bg text-primary-foreground glow-shadow hover:opacity-90">Get Started</Button>
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 space-y-6"
      >
        <span className="inline-block gradient-bg text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          AI-Powered Dropshipping
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
          <span className="gradient-text">Automate.</span> <span className="gradient-text">Scale.</span>{" "}
          <span className="gradient-text">Profit.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Turn ideas into income with the world's smartest dropshipping platform. Discover winning products, build
          stores, and scale globally — all powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup">
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground text-lg px-8 py-6 glow-shadow hover:opacity-90 animate-pulse-glow"
            >
              Start Free <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-border hover:bg-muted/50">
              <Play size={16} className="mr-2" /> Watch Demo
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">No credit card required · Free 14-day trial</p>
      </motion.div>
    </section>

    {/* Stats */}
    <section className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={itemVariant} className="glass-card p-6 text-center space-y-2">
            <s.icon size={20} className="mx-auto text-primary" />
            <p className="font-display font-bold text-2xl">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Why choose <span className="gradient-text">Zyvoraz?</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Everything you need to build a profitable dropshipping business, in one platform.
        </p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={itemVariant}
            className="glass-card p-6 space-y-3 hover:border-primary/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
              <f.icon size={22} className="text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* How it Works */}
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          How it <span className="gradient-text">works</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Three simple steps to your first profitable dropshipping store.
        </p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {steps.map((step) => (
          <motion.div key={step.number} variants={itemVariant} className="text-center space-y-4">
            <span className="font-display text-6xl font-bold gradient-text opacity-30">{step.number}</span>
            <h3 className="font-display font-bold text-xl">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Testimonials */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Loved by <span className="gradient-text">sellers worldwide</span>
        </h2>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {testimonials.map((t) => (
          <motion.div key={t.name} variants={itemVariant} className="glass-card p-6 space-y-4">
            <div className="flex gap-1">
              {Array.from({ length: t.stars }).map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-bold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Pricing */}
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Simple, <span className="gradient-text">transparent pricing</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Start free. Scale as you grow. No hidden fees.</p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={itemVariant}
            className={`glass-card p-8 space-y-6 relative ${plan.highlight ? "border-primary/60 glow-shadow" : ""}`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="font-display font-bold text-xl">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-primary shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block">
              <Button
                className={`w-full ${plan.highlight ? "gradient-bg text-primary-foreground glow-shadow hover:opacity-90" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Final CTA */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-12 md:p-20 text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <h2 className="font-display text-3xl md:text-5xl font-bold relative z-10">
          Ready to build your <span className="gradient-text">global empire?</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto relative z-10">
          Join 12,000+ sellers already scaling with Zyvoraz. Start your free trial today — no credit card needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link to="/signup">
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground text-lg px-10 py-6 glow-shadow hover:opacity-90"
            >
              Start Free Trial <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          © 2026 Zyvoraz. All rights reserved. Your Global Selling Engine.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Use
          </Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  </div>
);

export default Index;
