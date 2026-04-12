import { useState } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SourcingRequest = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    toast.success("Sourcing request submitted!");
    setSubmitted(true);
    setProductName("");
    setDescription("");
    setTargetPrice("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Search size={28} className="text-primary" /> Sourcing Request
        </h1>
        <p className="text-muted-foreground">Request specific products from our supplier network</p>
      </div>

      <div className="glass-card p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input
              placeholder="e.g. Smart Water Bottle with Temperature Display"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the product you're looking for, including features, colors, materials..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Target Price (USD)</Label>
            <Input
              type="number"
              placeholder="e.g. 15"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <Button type="submit" className="gradient-bg text-primary-foreground glow-shadow hover:opacity-90">
            <Send size={16} className="mr-2" /> Submit Request
          </Button>
        </form>
      </div>

      {submitted && (
      <div className="glass-card p-6 border-primary/30 max-w-2xl">
        <p className="text-primary font-medium">✅ Your sourcing request has been submitted. Our team will get back to you within 24-48 hours.</p>
        </div>
      )}
    </div>
  );
};

export default SourcingRequest;
