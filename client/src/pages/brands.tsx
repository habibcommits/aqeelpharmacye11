import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@shared/schema";

import cetaphilLogo from "@assets/stock_images/cetaphil_skincare_br_5e41b442.jpg";
import ceraveLogo from "@assets/stock_images/cerave_skincare_bran_91b21ecf.jpg";
import doveLogo from "@assets/stock_images/dove_beauty_brand_lo_3deafb74.jpg";
import lorealLogo from "@assets/stock_images/l'oreal_beauty_cosme_0a109609.jpg";
import ordinaryLogo from "@assets/stock_images/skincare_serum_bottl_8b7062d6.jpg";
import maybellineLogo from "@assets/stock_images/maybelline_makeup_co_666678e4.jpg";
import panteneLogo from "@assets/stock_images/pantene_shampoo_hair_bd5703bf.jpg";
import neutrogenaLogo from "@assets/stock_images/neutrogena_skincare__3ce100c2.jpg";
import garnierLogo from "@assets/stock_images/garnier_natural_beau_22ccbb07.jpg";
import niveaLogo from "@assets/stock_images/nivea_skincare_cream_f3981ddd.jpg";
import keuneLogo from "@assets/stock_images/professional_hair_ca_10174b47.jpg";
import sunscreenLogo from "@assets/stock_images/sunscreen_lotion_bot_1c2f4325.jpg";

const defaultBrands = [
  { id: "1", name: "Cetaphil", slug: "cetaphil", logo: cetaphilLogo, description: "Gentle skincare for all skin types", category: "Skin Care" },
  { id: "2", name: "CeraVe", slug: "cerave", logo: ceraveLogo, description: "Developed with dermatologists", category: "Skin Care" },
  { id: "3", name: "The Ordinary", slug: "the-ordinary", logo: ordinaryLogo, description: "Clinical formulations with integrity", category: "Skin Care" },
  { id: "4", name: "L'Oreal", slug: "loreal", logo: lorealLogo, description: "Because you're worth it", category: "Makeup" },
  { id: "5", name: "Maybelline", slug: "maybelline", logo: maybellineLogo, description: "Maybe she's born with it", category: "Makeup" },
  { id: "6", name: "Jenpharm", slug: "jenpharm", logo: sunscreenLogo, description: "Professional skincare solutions", category: "Sunscreen" },
  { id: "7", name: "Neutrogena", slug: "neutrogena", logo: neutrogenaLogo, description: "Dermatologist recommended", category: "Skin Care" },
  { id: "8", name: "Keune", slug: "keune", logo: keuneLogo, description: "Professional hair care", category: "Hair Care" },
  { id: "9", name: "Pantene", slug: "pantene", logo: panteneLogo, description: "Strong is beautiful", category: "Hair Care" },
  { id: "10", name: "Garnier", slug: "garnier", logo: garnierLogo, description: "Take care", category: "Hair Care" },
  { id: "11", name: "Nivea", slug: "nivea", logo: niveaLogo, description: "Trusted skincare", category: "Skin Care" },
  { id: "12", name: "Dove", slug: "dove", logo: doveLogo, description: "Real beauty", category: "Hair Care" },
];

export default function BrandsPage() {
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const displayBrands = brands?.length ? brands.map(b => {
    const defaultBrand = defaultBrands.find(db => db.slug === b.slug);
    return {
      ...b,
      logo: defaultBrand?.logo || b.logo,
      category: defaultBrand?.category || "General"
    };
  }) : defaultBrands;

  const groupedBrands = displayBrands.reduce((acc, brand) => {
    const category = (brand as typeof defaultBrands[0]).category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(brand);
    return acc;
  }, {} as Record<string, typeof displayBrands>);

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
          <div className="space-y-12">
            {Object.entries(groupedBrands).map(([category, categoryBrands]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold">{category}</h2>
                  <Badge variant="secondary">{categoryBrands.length} brands</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryBrands.map((brand) => (
                    <Link key={brand.id} href={`/products?brand=${brand.slug}`}>
                      <Card 
                        className="hover-elevate cursor-pointer overflow-hidden"
                        data-testid={`brand-page-card-${brand.slug}`}
                      >
                        <div className="aspect-video overflow-hidden">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-lg font-semibold text-muted-foreground">{brand.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{brand.name}</h3>
                          {brand.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {brand.description}
                            </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
