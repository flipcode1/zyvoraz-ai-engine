import { useState } from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CHAMPION_PRODUCTS } from "@/lib/mock-data";
import { toast } from "sonner";

const AdminProducts = () => {
  const [products, setProducts] = useState(CHAMPION_PRODUCTS);
  const [form, setForm] = useState({
    name: "",
    image: "",
    niche: "",
    price: 0,
    sellPrice: 0,
    description: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.image) {
      toast.error("Name and image are required");
      return;
    }
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: form.name,
      image: form.image,
      niche: form.niche || "general",
      profitMargin: "0%",
      orders: "0",
      source: "Manual",
      trendLevel: "stable",
      price: Number(form.price),
      sellPrice: Number(form.sellPrice),
      description: form.description,
      benefits: [],
      targetAudience: "",
    };
    setProducts([newProduct, ...products]);
    setForm({ name: "", image: "", niche: "", price: 0, sellPrice: 0, description: "" });
    toast.success("Product added");
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product removed");
  };

  return (
    <div className="min-h-screen bg-background p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Package size={28} className="text-primary" /> Admin Products
        </h1>
        <p className="text-muted-foreground">Manage product catalog</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div>
            <Label>Niche</Label>
            <Input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} />
          </div>
          <div>
            <Label>Cost Price</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Sell Price</Label>
            <Input
              type="number"
              value={form.sellPrice}
              onChange={(e) => setForm({ ...form, sellPrice: Number(e.target.value) })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="gradient-bg text-primary-foreground">
              Add Product
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="p-4 space-y-2">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-32 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <h3 className="font-semibold truncate">{p.name}</h3>
            <p className="text-sm text-muted-foreground">${p.sellPrice}</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(p.id)}
              className="w-full"
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
