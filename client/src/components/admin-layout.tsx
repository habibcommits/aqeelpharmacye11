import { Link, useLocation, Redirect } from "wouter";
import { 
  LayoutDashboard, Package, ShoppingCart, Tags, Download, 
  Home, Moon, Sun, LogOut, Store 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/lib/theme-context";
import { useAdminAuth } from "@/lib/admin-auth-context";
import logoImage from "@assets/aqeelph_logo_1765266347695.png";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/import", label: "Import", icon: Download },
  { href: "/admin/najeeb-import", label: "Najeeb Pharmacy", icon: Store },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <Link href="/">
            <img 
              src={logoImage} 
              alt="Aqeel Pharmacy" 
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || 
                (item.href !== "/admin" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    data-testid={`admin-nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t space-y-1">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start" data-testid="admin-nav-storefront">
              <Home className="w-4 h-4 mr-3" />
              View Storefront
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="w-4 h-4 mr-3" />
            ) : (
              <Sun className="w-4 h-4 mr-3" />
            )}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive" 
            onClick={handleLogout}
            data-testid="admin-nav-logout"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/">
              <img 
                src={logoImage} 
                alt="Aqeel Pharmacy" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <nav className="md:hidden flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location === item.href || 
                (item.href !== "/admin" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                  >
                    <item.icon className="w-4 h-4" />
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="md:hidden">
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="md:hidden"
              data-testid="admin-mobile-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Home className="w-4 h-4 mr-2" />
                Storefront
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
