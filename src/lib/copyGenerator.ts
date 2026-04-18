const SUPABASE_URL = "https://ydelgeezinawimqpgufk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWxnZWV6aW5hd2ltcXBndWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODk3MDgsImV4cCI6MjA5MTg2NTcwOH0.szCuCMbWdrLoo_lflio3L0WhKXYM_UCGAXnBqLIzQlU";

export interface MarketingCopies {
  facebook: string;
  tiktok: string;
  instagram: string;
  email: string;
}

export async function generateMarketingCopy(
  productName: string,
  productDescription: string,
  niche: string,
): Promise<MarketingCopies> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        productName,
        productDescription,
        niche,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.copies;
  } catch (error) {
    console.error("Error generating copy:", error);
    // Fallback copies
    return {
      facebook: "🚀 LIMITED STOCK! Get yours before it's gone!",
      tiktok: "POV: You found THE product of 2024 ✨",
      instagram: "Your new obsession just dropped 💫 #viral #tiktokmademebuyit",
      email: "⚡ FLASH SALE ⚡ 50% OFF Today Only!",
    };
  }
}
