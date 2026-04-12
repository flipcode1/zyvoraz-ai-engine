import { Sparkles, FileText, TrendingUp, Target, Zap, Globe } from "lucide-react";

const tools = [
  { name: "Product Page Generator", desc: "Create high-converting product pages with AI", icon: FileText, status: "Active" },
  { name: "Trend Analyzer", desc: "Analyze market trends and predict winners", icon: TrendingUp, status: "Coming Soon" },
  { name: "Ad Copy Writer", desc: "Generate compelling ad copy for any platform", icon: Target, status: "Coming Soon" },
  { name: "Price Optimizer", desc: "AI-powered pricing strategy recommendations", icon: Zap, status: "Coming Soon" },
  { name: "Market Research", desc: "Deep-dive into market data and competition", icon: Globe, status: "Coming Soon" },
  { name: "SEO Optimizer", desc: "Optimize product listings for search engines", icon: Sparkles, status: "Coming Soon" },
];

const AIToolsSection = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-3xl font-bold flex items-center gap-2"><Sparkles size={28} className="text-primary" /> AI Tools</h1>
      <p className="text-muted-foreground">Powerful AI tools to supercharge your business</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map(t => (
        <div key={t.name} className={`glass-card p-5 space-y-3 ${t.status === "Active" ? "border-primary/30" : "opacity-60"}`}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <t.icon size={20} className="text-primary-foreground" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>{t.status}</span>
          </div>
          <h3 className="font-semibold">{t.name}</h3>
          <p className="text-sm text-muted-foreground">{t.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AIToolsSection;
