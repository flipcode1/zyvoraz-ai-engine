import { useState, useRef, useEffect } from "react";
import { HeadphonesIcon, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const QUICK_REPLIES = ["Track my order", "Request a refund", "Product issue", "Shipping delay"];

const getReply = (input: string): string => {
  const msg = input.toLowerCase();
  if (msg.includes("track") || msg.includes("order"))
    return "I can help you track your order! Please share your order ID and I'll look it up right away.";
  if (msg.includes("refund") || msg.includes("money"))
    return "I'm sorry to hear that! Refunds are processed within 3-5 business days. I'll start the process for you now.";
  if (msg.includes("ship") || msg.includes("delay") || msg.includes("delivery"))
    return "Shipping delays can happen due to high demand. Your order is on its way — I'll send you an updated tracking link shortly.";
  if (msg.includes("product") || msg.includes("issue") || msg.includes("broken") || msg.includes("defect"))
    return "I'm really sorry about that! I've escalated this to our specialist team. They'll follow up within 24 hours with a solution.";
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey"))
    return "Hey there! 👋 Happy to help. What can I assist you with today?";
  const fallbacks = [
    "Thanks for reaching out! Let me look into this for you right away.",
    "Great question! Our team is on it — you'll hear back within 24 hours.",
    "I've noted your concern and escalated it to the right team. Anything else I can help with?",
    "I understand. Could you provide a bit more detail so I can assist you better?",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// ─── Typing Indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0">
        <Bot size={14} className="text-primary-foreground" />
      </div>
      <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const CustomerSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Welcome to Zyvoraz Support! How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text?: string) => {
    const messageText = text ?? input;
    if (!messageText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: getReply(messageText),
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <HeadphonesIcon size={28} className="text-primary" /> Customer Support
        </h1>
        <p className="text-muted-foreground">AI-powered support assistant</p>
      </div>

      {/* Chat window */}
      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2">
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === "user" ? "gradient-bg text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      m.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 2 && !isTyping && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-border p-3 flex gap-2">
          <Input
            placeholder={isTyping ? "Support is typing..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={isTyping}
            className="bg-muted/50"
          />
          <Button
            onClick={() => send()}
            size="icon"
            variant="gradient"
            disabled={isTyping || !input.trim()}
            className="shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
