import { Zap } from "lucide-react";

const ZyvorazLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const iconSizes = { sm: 16, md: 22, lg: 32 };
  return (
    <div className="flex items-center gap-2">
      <div className="gradient-bg rounded-lg p-1.5">
        <Zap size={iconSizes[size]} className="text-primary-foreground" />
      </div>
      <span className={`font-display font-bold ${sizes[size]} gradient-text`}>
        Zyvoraz
      </span>
    </div>
  );
};

export default ZyvorazLogo;
