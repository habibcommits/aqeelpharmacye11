import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, X, Moon, Sun, Phone, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import logoImage from "@assets/stock_images/pharmacy_logo_medica_fe9d3f91.jpg";

const categories = [
  { name: "Skin Care", slug: "skin-care" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Makeup", slug: "makeup" },
  { name: "Fragrance", slug: "fragrance" },
  { name: "Sunscreen", slug: "sunscreen" },
  { name: "Baby", slug: "baby" },
  { name: "Vitamins", slug: "vitamins" },
  { name: "Medicines", slug: "medicines" },
];

export function Header() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="bg-primary text-primary-foreground py-1.5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Free Delivery over Rs 10,000</span>
                <span className="sm:hidden">Free Delivery 10k+</span>
              </span>
              <Link href="/policies/refund" className="flex items-center gap-1.5 hover:underline">
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exchange & Refund Policy</span>
                <span className="md:hidden">Returns</span>
              </Link>
            </div>
            <Link href="/track-order" className="flex items-center gap-1.5 hover:underline">
              <Phone className="w-3.5 h-3.5" />
              Track Order
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <img 
              src={logoImage} 
              alt="AQeel Pharmacy" 
              className="h-12 md:h-14 w-auto"
              data-testid="img-logo"
            />
          </Link>

          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            <Link href="/account">
              <Button variant="ghost" size="icon" data-testid="button-account">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-4 mt-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-mobile-search"
                    />
                  </form>

                  <nav className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-muted-foreground px-2 py-2">Categories</p>
                    {categories.map((cat) => (
                      <Link 
                        key={cat.slug} 
                        href={`/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          data-testid={`link-category-${cat.slug}`}
                        >
                          {cat.name}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-4 flex flex-col gap-1">
                    <Link href="/brands" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start" data-testid="link-brands">
                        All Brands
                      </Button>
                    </Link>
                    <Link href="/track-order" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start" data-testid="link-track-order">
                        Track Order
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <nav className="hidden md:block border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-sm whitespace-nowrap"
                  data-testid={`nav-category-${cat.slug}`}
                >
                  {cat.name}
                </Button>
              </Link>
            ))}
            <Link href="/brands">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-sm whitespace-nowrap"
                data-testid="nav-brands"
              >
                Brands
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
