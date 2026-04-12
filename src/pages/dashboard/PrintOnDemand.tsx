import { Palette, Shirt, Coffee, Phone } from "lucide-react";

const categories = [
  { name: "T-Shirts", icon: Shirt, count: 120 },
  { name: "Mugs", icon: Coffee, count: 85 },
  { name: "Phone Cases", icon: Phone, count: 64 },
  { name: "Posters", icon: Palette, count: 200 },
];

const PrintOnDemand = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-3xl font-bold flex items-center gap-2">
        <Palette size={28} className="text-primary" /> Print On Demand
      </h1>
      <p className="text-muted-foreground">Design and sell custom products — no inventory needed</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((c) => (
        <div key={c.name} className="glass-card p-6 text-center space-y-3 hover:border-primary/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 mx-auto rounded-lg gradient-bg flex items-center justify-center">
            <c.icon size={24} className="text-primary-foreground" />
          </div>
          <h3 className="font-semibold">{c.name}</h3>
          <p className="text-sm text-muted-foreground">{c.count} designs available</p>
        </div>
      ))}
    </div>

    <div className="glass-card p-8 text-center space-y-3">
      <Palette size={48} className="mx-auto text-muted-foreground" />
      <h3 className="font-display text-xl font-bold">Coming Soon</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Full Print On Demand integration is being built. You'll be able to design, upload, and sell custom products directly from Zyvoraz.
      </p>
    </div>
  </div>
);

export default PrintOnDemand;
