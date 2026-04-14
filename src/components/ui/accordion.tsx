import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

// ─── AccordionItem ─────────────────────────────────────────────────────────────
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    variant?: "default" | "ghost" | "card";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "transition-colors",
      variant === "default" && "border-b border-border",
      variant === "ghost" && "border-none",
      variant === "card" && "glass-card mb-2 px-4 rounded-xl border border-border",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// ─── AccordionTrigger ──────────────────────────────────────────────────────────
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: React.ReactNode;
  }
>(({ className, children, icon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium text-sm",
        "transition-colors duration-200",
        "hover:text-primary",
        "text-left",
        "[&[data-state=open]>span.accordion-icon]:rotate-180",
        "[&[data-state=open]]:text-primary",
        className,
      )}
      {...props}
    >
      {children}
      <span className="accordion-icon shrink-0 transition-transform duration-300 ml-2">
        {icon ?? <ChevronDown className="h-4 w-4" />}
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

// ─── AccordionContent ──────────────────────────────────────────────────────────
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-5 pt-0 text-muted-foreground leading-relaxed", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
