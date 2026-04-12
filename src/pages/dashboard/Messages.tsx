import { useState } from "react";
import { MessageSquare } from "lucide-react";

const mockConversations = [
  { id: "1", name: "Supplier - AliExpress", lastMsg: "Your order #ZYV-003 has been shipped", time: "2h ago", unread: true },
  { id: "2", name: "Customer - Sarah M.", lastMsg: "Thank you for the quick delivery!", time: "5h ago", unread: false },
  { id: "3", name: "Support Team", lastMsg: "Your store has been verified", time: "1d ago", unread: false },
  { id: "4", name: "Zyvoraz Updates", lastMsg: "New AI tools are now available!", time: "2d ago", unread: true },
];

const Messages = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <MessageSquare size={28} className="text-primary" /> Messages
        </h1>
        <p className="text-muted-foreground">Your inbox and conversations</p>
      </div>

      <div className="glass-card divide-y divide-border">
        {mockConversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors ${selected === c.id ? "bg-muted/50" : ""}`}
          >
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{c.lastMsg}</p>
            </div>
            {c.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />}
          </button>
        ))}
      </div>

      {selected && (
        <div className="glass-card p-6 text-center space-y-2">
          <MessageSquare size={32} className="mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Full messaging system coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
