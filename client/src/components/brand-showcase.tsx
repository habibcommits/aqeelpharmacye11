import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Brand } from "@shared/schema";

const defaultBrands = [
  { id: "1", name: "Cetaphil", slug: "cetaphil", logo: "https://via.placeholder.com/150x80?text=Cetaphil" },
  { id: "2", name: "CeraVe", slug: "cerave", logo: "https://via.placeholder.com/150x80?text=CeraVe" },
  { id: "3", name: "The Ordinary", slug: "the-ordinary", logo: "https://via.placeholder.com/150x80?text=The+Ordinary" },
  { id: "4", name: "L'Oreal", slug: "loreal", logo: "https://via.placeholder.com/150x80?text=L'Oreal" },
  { id: "5", name: "Maybelline", slug: "maybelline", logo: "https://via.placeholder.com/150x80?text=Maybelline" },
  { id: "6", name: "Jenpharm", slug: "jenpharm", logo: "https://via.placeholder.com/150x80?text=Jenpharm" },
  { id: "7", name: "Conatural", slug: "conatural", logo: "https://via.placeholder.com/150x80?text=Conatural" },
  { id: "8", name: "Keune", slug: "keune", logo: "https://via.placeholder.com/150x80?text=Keune" },
  { id: "9", name: "TRESemme", slug: "tresemme", logo: "https://via.placeholder.com/150x80?text=TRESemme" },
  { id: "10", name: "Pantene", slug: "pantene", logo: "https://via.placeholder.com/150x80?text=Pantene" },
  { id: "11", name: "Sunsilk", slug: "sunsilk", logo: "https://via.placeholder.com/150x80?text=Sunsilk" },
  { id: "12", name: "Dove", slug: "dove", logo: "https://via.placeholder.com/150x80?text=Dove" },
];

interface BrandShowcaseProps {
  brands?: Brand[];
  showAll?: boolean;
}

export function BrandShowcase({ brands, showAll = false }: BrandShowcaseProps) {
  const displayBrands = brands?.length ? brands : defaultBrands;
  const visibleBrands = showAll ? displayBrands : displayBrands.slice(0, 12);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Top Brands</h2>
            <p className="text-muted-foreground">Shop from your favorite brands</p>
          </div>
          {!showAll && (
            <Button variant="outline" asChild>
              <Link href="/brands" data-testid="link-view-all-brands">
                View All
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleBrands.map((brand) => (
            <Link key={brand.id} href={`/products?brand=${brand.slug}`}>
              <Card 
                className="hover-elevate cursor-pointer p-4 flex items-center justify-center aspect-video"
                data-testid={`brand-card-${brand.slug}`}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{brand.name}</span>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
