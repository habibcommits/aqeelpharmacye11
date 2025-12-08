import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBanner } from "@/components/hero-banner";
import { CategoryGrid } from "@/components/category-grid";
import { TrustIndicators } from "@/components/trust-indicators";
import { BrandShowcase } from "@/components/brand-showcase";
import { ProductGrid } from "@/components/product-grid";
import type { Product, Banner, Brand } from "@shared/schema";

export default function HomePage() {
  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const { data: featuredProducts = [], isLoading: loadingFeatured } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  return (
    <div className="min-h-screen">
      <HeroBanner banners={banners} />
      
      <TrustIndicators />
      
      <CategoryGrid />

      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked bestsellers for you</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products" data-testid="link-view-all-products">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} isLoading={loadingFeatured} />
        </div>
      </section>

      <BrandShowcase brands={brands} />

      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Your Trusted Pharmacy Partner
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
            Shop authentic health, beauty, and wellness products with fast delivery across Pakistan. 
            Cash on Delivery available for all orders.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products" data-testid="link-shop-now">
              Shop Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
