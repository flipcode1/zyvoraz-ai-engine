import { useState, useRef, useEffect } from "react";
import { HeadphonesIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const botReplies = [
  "Thanks for reaching out! I'm checking your issue now.",
  "I can help with that. Could you provide more details?",
  "Our team is working on this. You should see a resolution within 24 hours.",
  "Great question! Here's what I recommend...",
  "I've escalated this to our specialist team. They'll follow up shortly.",
];

const CustomerSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "👋 Welcome to Zyvoraz Support! How can I help you today?", sender: "bot", time: "Now" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: botReplies[Math.floor(Math.random() * botReplies.length)],
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <HeadphonesIcon size={28} className="text-primary" /> Customer Support
        </h1>
        <p className="text-muted-foreground">AI-powered support assistant</p>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === "user" ? "gradient-bg text-primary-foreground" : "bg-muted"}`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-3 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="bg-muted/50"
          />
          <Button onClick={send} size="icon" className="gradient-bg text-primary-foreground glow-shadow shrink-0">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
