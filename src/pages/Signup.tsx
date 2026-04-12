import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ZyvorazLogo from "@/components/ZyvorazLogo";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/login",
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); } else { setSent(true); }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full gradient-bg mx-auto flex items-center justify-center text-2xl">✉️</div>
          <h2 className="font-display text-2xl font-bold">Check Your Email</h2>
          <p className="text-muted-foreground">We sent a verification link to <strong className="text-foreground">{email}</strong>. Click it to activate your account.</p>
          <Link to="/login"><Button variant="outline" className="mt-4">Back to Login</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6"><ZyvorazLogo size="lg" /></div>
          <h2 className="font-display text-2xl font-bold">Create Your Account</h2>
          <p className="text-muted-foreground mt-1">Start your dropshipping journey</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required className="bg-muted/50 border-border pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-bg text-primary-foreground font-semibold h-12 text-base glow-shadow hover:opacity-90 transition-opacity">
            <UserPlus size={18} className="mr-2" /> {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
