import { CHAMPION_PRODUCTS } from "./mock-data";

type Product = (typeof CHAMPION_PRODUCTS)[0];

export type CopyTone = "persuasive" | "friendly" | "luxury" | "urgent" | "minimal";
export type CopyPlatform = "shopify" | "tiktok" | "facebook" | "instagram" | "email";

export interface GeneratedCopy {
  headline: string;
  subheadline: string;
  description: string;
  bullets: string[];
  cta: string;
  hashtags: string[];
  hook: string;
}

const TONE_PREFIXES: Record<CopyTone, string[]> = {
  persuasive: ["Discover", "Unlock", "Experience", "Transform"],
  friendly: ["Meet", "Say hello to", "Introducing", "You'll love"],
  luxury: ["Indulge in", "Elevate with", "Refined", "Crafted for"],
  urgent: ["Last chance:", "Limited drop:", "Don't miss", "Selling fast:"],
  minimal: ["The", "Simply", "Pure", "Just"],
};

const CTA_BY_TONE: Record<CopyTone, string> = {
  persuasive: "Claim Yours Now",
  friendly: "Grab One Today",
  luxury: "Order Exclusively",
  urgent: "Buy Before It's Gone",
  minimal: "Shop Now",
};

const HOOK_BY_PLATFORM: Record<CopyPlatform, (p: Product) => string> = {
  tiktok: (p) => `POV: you finally tried the ${p.name.toLowerCase()} everyone's talking about 🤯`,
  facebook: (p) => `Why thousands of customers are switching to the ${p.name}.`,
  instagram: (p) => `The ${p.name} is the upgrade your routine needed ✨`,
  shopify: (p) => `${p.name} — designed to deliver real results.`,
  email: (p) => `Your ${p.niche} routine is about to change forever.`,
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateCopy = (
  product: Product,
  tone: CopyTone = "persuasive",
  platform: CopyPlatform = "shopify"
): GeneratedCopy => {
  const prefix = pick(TONE_PREFIXES[tone]);
  const benefitsList = product.benefits.length ? product.benefits : ["Premium quality", "Fast results"];

  return {
    headline: `${prefix} the ${product.name}`,
    subheadline: `${benefitsList[0]} — without compromise.`,
    description: `${product.description} Loved by ${product.targetAudience.toLowerCase()}, the ${product.name} combines premium design with proven performance to give you results you can feel from day one.`,
    bullets: benefitsList.map((b) => `✓ ${b}`),
    cta: CTA_BY_TONE[tone],
    hashtags: [
      `#${product.niche}`,
      `#${product.name.replace(/\s+/g, "")}`,
      "#trending",
      "#musthave",
      "#viral",
    ],
    hook: HOOK_BY_PLATFORM[platform](product),
  };
};

export const generateAdScript = (product: Product, tone: CopyTone = "persuasive"): string => {
  const copy = generateCopy(product, tone, "tiktok");
  return [
    `[HOOK 0-3s]: ${copy.hook}`,
    `[PROBLEM 3-8s]: Tired of products that overpromise and underdeliver?`,
    `[SOLUTION 8-18s]: ${copy.description}`,
    `[BENEFITS 18-25s]: ${copy.bullets.join(" • ")}`,
    `[CTA 25-30s]: ${copy.cta} — link in bio.`,
  ].join("\n\n");
};

export const generateEmailSubject = (product: Product): string[] => [
  `${product.name} just dropped 👀`,
  `Your ${product.niche} game changes today`,
  `Inside: the secret behind the ${product.name}`,
  `Last chance to get the ${product.name}`,
];

export const formatCopyAsText = (copy: GeneratedCopy): string =>
  [
    `HEADLINE: ${copy.headline}`,
    `SUBHEADLINE: ${copy.subheadline}`,
    "",
    `HOOK: ${copy.hook}`,
    "",
    "DESCRIPTION:",
    copy.description,
    "",
    "BULLETS:",
    ...copy.bullets,
    "",
    `CTA: ${copy.cta}`,
    "",
    `HASHTAGS: ${copy.hashtags.join(" ")}`,
  ].join("\n");
