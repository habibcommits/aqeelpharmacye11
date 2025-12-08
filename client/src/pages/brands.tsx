import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Brand } from "@shared/schema";

const defaultBrands: Brand[] = [
  { id: "1", name: "Cetaphil", slug: "cetaphil", logo: "https://via.placeholder.com/200x100?text=Cetaphil", description: "Gentle skincare for all skin types" },
  { id: "2", name: "CeraVe", slug: "cerave", logo: "https://via.placeholder.com/200x100?text=CeraVe", description: "Developed with dermatologists" },
  { id: "3", name: "The Ordinary", slug: "the-ordinary", logo: "https://via.placeholder.com/200x100?text=The+Ordinary", description: "Clinical formulations with integrity" },
  { id: "4", name: "L'Oreal", slug: "loreal", logo: "https://via.placeholder.com/200x100?text=L'Oreal", description: "Because you're worth it" },
  { id: "5", name: "Maybelline", slug: "maybelline", logo: "https://via.placeholder.com/200x100?text=Maybelline", description: "Maybe she's born with it" },
  { id: "6", name: "Jenpharm", slug: "jenpharm", logo: "https://via.placeholder.com/200x100?text=Jenpharm", description: "Professional skincare solutions" },
  { id: "7", name: "Conatural", slug: "conatural", logo: "https://via.placeholder.com/200x100?text=Conatural", description: "Natural beauty products" },
  { id: "8", name: "Keune", slug: "keune", logo: "https://via.placeholder.com/200x100?text=Keune", description: "Professional hair care" },
  { id: "9", name: "TRESemme", slug: "tresemme", logo: "https://via.placeholder.com/200x100?text=TRESemme", description: "Salon-quality hair care" },
  { id: "10", name: "Pantene", slug: "pantene", logo: "https://via.placeholder.com/200x100?text=Pantene", description: "Strong is beautiful" },
  { id: "11", name: "Sunsilk", slug: "sunsilk", logo: "https://via.placeholder.com/200x100?text=Sunsilk", description: "Hair full of life" },
  { id: "12", name: "Dove", slug: "dove", logo: "https://via.placeholder.com/200x100?text=Dove", description: "Real beauty" },
  { id: "13", name: "Neutrogena", slug: "neutrogena", logo: "https://via.placeholder.com/200x100?text=Neutrogena", description: "Dermatologist recommended" },
  { id: "14", name: "Garnier", slug: "garnier", logo: "https://via.placeholder.com/200x100?text=Garnier", description: "Take care" },
  { id: "15", name: "Nivea", slug: "nivea", logo: "https://via.placeholder.com/200x100?text=Nivea", description: "Trusted skincare" },
  { id: "16", name: "St. Ives", slug: "st-ives", logo: "https://via.placeholder.com/200x100?text=St.+Ives", description: "Feel great in your skin" },
];

export default function BrandsPage() {
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const displayBrands = brands?.length ? brands : defaultBrands;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Brands</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Shop from top international and local brands. We stock only authentic, genuine products.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/1] rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayBrands.map((brand) => (
              <Link key={brand.id} href={`/products?brand=${brand.slug}`}>
                <Card 
                  className="hover-elevate cursor-pointer p-6 flex flex-col items-center justify-center aspect-[2/1]"
                  data-testid={`brand-page-card-${brand.slug}`}
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-12 object-contain mb-2"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg font-semibold">{brand.name}</span>
                  )}
                  {brand.description && (
                    <p className="text-xs text-muted-foreground text-center line-clamp-2 mt-2">
                      {brand.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
