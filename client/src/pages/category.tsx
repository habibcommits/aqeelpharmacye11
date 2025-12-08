import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ChevronLeft, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductGrid } from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Category } from "@shared/schema";

const categoryInfo: Record<string, { name: string; description: string; image: string }> = {
  "skin-care": {
    name: "Skin Care",
    description: "Cleansers, moisturizers, serums, and treatments for healthy, glowing skin",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=400&fit=crop",
  },
  "hair-care": {
    name: "Hair Care",
    description: "Shampoos, conditioners, serums, and treatments for beautiful hair",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&h=400&fit=crop",
  },
  "makeup": {
    name: "Makeup",
    description: "Lipsticks, foundations, palettes, and all your beauty essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop",
  },
  "fragrance": {
    name: "Fragrance",
    description: "Perfumes, body mists, and signature scents for every occasion",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=400&fit=crop",
  },
  "sunscreen": {
    name: "Sunscreen",
    description: "SPF protection for all skin types and activities",
    image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=1200&h=400&fit=crop",
  },
  "baby": {
    name: "Baby Care",
    description: "Gentle, safe products for your little ones",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&h=400&fit=crop",
  },
  "vitamins": {
    name: "Vitamins & Supplements",
    description: "Essential vitamins, minerals, and health supplements",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=400&fit=crop",
  },
  "medicines": {
    name: "Medicines",
    description: "Over-the-counter medicines and healthcare products",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=400&fit=crop",
  },
};

type SortOption = "newest" | "price-low" | "price-high" | "name";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const info = categoryInfo[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop",
  };

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/category", slug],
  });

  const sortedProducts = useMemo(() => {
    const result = [...products];
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={info.image}
          alt={info.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="text-category-name">
              {info.name}
            </h1>
            {info.description && (
              <p className="text-white/80 max-w-xl">{info.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products" data-testid="link-all-products">
                <ChevronLeft className="w-4 h-4 mr-1" />
                All Products
              </Link>
            </Button>
            <span className="text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-24 inline-block" />
              ) : (
                `${sortedProducts.length} product${sortedProducts.length !== 1 ? "s" : ""}`
              )}
            </span>
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-40" data-testid="select-sort-category">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ProductGrid products={sortedProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}
