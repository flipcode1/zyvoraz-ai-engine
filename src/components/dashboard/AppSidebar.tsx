import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ZyvorazLogo from "@/components/ZyvorazLogo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ShoppingBag,
  Palette,
  ClipboardList,
  Search,
  Package,
  Bookmark,
  HeadphonesIcon,
  MessageSquare,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

const menuItems = [
  const menuItems = [
  { title: "Marketplace", path: "/dashboard/marketplace", icon: ShoppingBag },
  { title: "Print On Demand", path: "/dashboard/print-on-demand", icon: Palette },
  { title: "Orders", path: "/dashboard/orders", icon: ClipboardList },
  { title: "Sourcing Request", path: "/dashboard/sourcing", icon: Search },
  { title: "Products", path: "/dashboard/products", icon: Package },
  { title: "Safe Place", path: "/dashboard/safe-place", icon: Bookmark },
  { title: "Customer Support", path: "/dashboard/support", icon: HeadphonesIcon },
  { title: "Messages", path: "/dashboard/messages", icon: MessageSquare },
  { title: "Admin", path: "/dashboard/admin", icon: Settings },  // ✅ CORRETO
]
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && <ZyvorazLogo size="sm" />}
        <Button
          onClick={() => navigate("/dashboard/products")}
          className="w-full mt-3 gradient-bg text-primary-foreground font-semibold glow-shadow hover:opacity-90"
          size={collapsed ? "icon" : "default"}
        >
          <Plus size={18} className={collapsed ? "" : "mr-2"} />
          {!collapsed && "Add Product"}
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/dashboard/marketplace" && location.pathname === "/dashboard");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-primary/15 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={handleLogout}
          className="w-full text-muted-foreground hover:text-foreground justify-start"
        >
          <LogOut size={18} className={collapsed ? "" : "mr-2"} />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
