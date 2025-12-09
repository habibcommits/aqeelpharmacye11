import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  { id: "1", name: "Cetaphil", slug: "cetaphil", logo: cetaphilLogo, category: "Skin Care" },
  { id: "2", name: "CeraVe", slug: "cerave", logo: ceraveLogo, category: "Skin Care" },
  { id: "3", name: "The Ordinary", slug: "the-ordinary", logo: ordinaryLogo, category: "Skin Care" },
  { id: "4", name: "L'Oreal", slug: "loreal", logo: lorealLogo, category: "Makeup" },
  { id: "5", name: "Maybelline", slug: "maybelline", logo: maybellineLogo, category: "Makeup" },
  { id: "6", name: "Jenpharm", slug: "jenpharm", logo: sunscreenLogo, category: "Sunscreen" },
  { id: "7", name: "Neutrogena", slug: "neutrogena", logo: neutrogenaLogo, category: "Skin Care" },
  { id: "8", name: "Keune", slug: "keune", logo: keuneLogo, category: "Hair Care" },
  { id: "9", name: "Pantene", slug: "pantene", logo: panteneLogo, category: "Hair Care" },
  { id: "10", name: "Garnier", slug: "garnier", logo: garnierLogo, category: "Hair Care" },
  { id: "11", name: "Nivea", slug: "nivea", logo: niveaLogo, category: "Skin Care" },
  { id: "12", name: "Dove", slug: "dove", logo: doveLogo, category: "Hair Care" },
];

interface BrandShowcaseProps {
  brands?: Brand[];
  showAll?: boolean;
}

export function BrandShowcase({ brands, showAll = false }: BrandShowcaseProps) {
  const displayBrands = brands?.length ? brands.map(b => ({
    ...b,
    logo: defaultBrands.find(db => db.slug === b.slug)?.logo || b.logo
  })) : defaultBrands;
  const visibleBrands = showAll ? displayBrands : displayBrands.slice(0, 12);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
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
                className="hover-elevate cursor-pointer p-4 flex flex-col items-center justify-center aspect-video"
                data-testid={`brand-card-${brand.slug}`}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover rounded-sm opacity-90 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{brand.name}</span>
                )}
                <span className="text-xs font-medium mt-2 text-center truncate w-full">{brand.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { defaultBrands };
