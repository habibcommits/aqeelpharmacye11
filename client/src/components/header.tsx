import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, X, Moon, Sun, Phone, Truck, RefreshCw, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import logoImage from "@assets/aqeelph_logo_1765266347695.png";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const { getItemCount, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const itemCount = getItemCount();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const suggestions = searchQuery.trim().length >= 2
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (slug: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setMobileMenuOpen(false);
    navigate(`/product/${slug}`);
  };

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="bg-primary text-primary-foreground py-1.5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              <a 
                href="tel:+923009109815" 
                className="flex items-center gap-1.5 hover:underline"
                data-testid="link-phone"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+92 300 9109815</span>
                <span className="sm:hidden">Call Us</span>
              </a>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Free Delivery over Rs 10,000</span>
                <span className="md:hidden hidden sm:inline">Free 10k+</span>
              </span>
              <Link href="/policies/refund" className="hidden md:flex items-center gap-1.5 hover:underline">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Returns</span>
              </Link>
            </div>
            <Link href="/track-order" className="flex items-center gap-1.5 hover:underline">
              <Package className="w-3.5 h-3.5" />
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
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 pr-4"
                data-testid="input-search"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleProductClick(product.slug)}
                      className="w-full flex items-center gap-3 p-3 hover-elevate text-left border-b last:border-b-0"
                      data-testid={`suggestion-${product.id}`}
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setShowSuggestions(false)}
                  >
                    <div className="p-3 text-center text-sm text-muted-foreground hover-elevate">
                      View all results for "{searchQuery}"
                    </div>
                  </Link>
                </div>
              )}
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
                  <div className="relative" ref={mobileSearchRef}>
                    <form onSubmit={handleSearch}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="pl-10"
                        data-testid="input-mobile-search"
                      />
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                        {suggestions.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductClick(product.slug)}
                            className="w-full flex items-center gap-3 p-3 hover-elevate text-left border-b last:border-b-0"
                            data-testid={`mobile-suggestion-${product.id}`}
                          >
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-primary font-semibold">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

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
