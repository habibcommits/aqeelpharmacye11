import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import cetaphilLogo from "@assets/stock_images/cetaphil_skincare_br_5e41b442.jpg";
import ceraveLogo from "@assets/stock_images/cerave_skincare_bran_91b21ecf.jpg";
import doveLogo from "@assets/stock_images/dove_beauty_brand_lo_3deafb74.jpg";
import lorealLogo from "@assets/stock_images/l'oreal_beauty_cosme_0a109609.jpg";
import maybellineLogo from "@assets/stock_images/maybelline_makeup_co_666678e4.jpg";
import panteneLogo from "@assets/stock_images/pantene_shampoo_hair_bd5703bf.jpg";
import neutrogenaLogo from "@assets/stock_images/neutrogena_skincare__3ce100c2.jpg";
import garnierLogo from "@assets/stock_images/garnier_natural_beau_22ccbb07.jpg";
import niveaLogo from "@assets/stock_images/nivea_skincare_cream_f3981ddd.jpg";
import keuneLogo from "@assets/stock_images/professional_hair_ca_10174b47.jpg";
import sunscreenLogo from "@assets/stock_images/sunscreen_lotion_bot_1c2f4325.jpg";

const categories = [
  {
    name: "Skin Care",
    slug: "skin-care",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
    description: "Cleansers, moisturizers & more",
    brands: [
      { name: "Cetaphil", slug: "cetaphil", logo: cetaphilLogo },
      { name: "CeraVe", slug: "cerave", logo: ceraveLogo },
      { name: "Neutrogena", slug: "neutrogena", logo: neutrogenaLogo },
      { name: "Nivea", slug: "nivea", logo: niveaLogo },
    ],
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop",
    description: "Shampoos, serums & treatments",
    brands: [
      { name: "Dove", slug: "dove", logo: doveLogo },
      { name: "Pantene", slug: "pantene", logo: panteneLogo },
      { name: "Keune", slug: "keune", logo: keuneLogo },
      { name: "Garnier", slug: "garnier", logo: garnierLogo },
    ],
  },
  {
    name: "Makeup",
    slug: "makeup",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    description: "Lipsticks, foundations & palettes",
    brands: [
      { name: "L'Oreal", slug: "loreal", logo: lorealLogo },
      { name: "Maybelline", slug: "maybelline", logo: maybellineLogo },
    ],
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    description: "Perfumes & body mists",
    brands: [],
  },
  {
    name: "Sunscreen",
    slug: "sunscreen",
    image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400&h=400&fit=crop",
    description: "SPF protection for all skin types",
    brands: [
      { name: "Jenpharm", slug: "jenpharm", logo: sunscreenLogo },
      { name: "Neutrogena", slug: "neutrogena", logo: neutrogenaLogo },
    ],
  },
  {
    name: "Baby Care",
    slug: "baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    description: "Gentle care for little ones",
    brands: [
      { name: "Dove", slug: "dove", logo: doveLogo },
      { name: "Cetaphil", slug: "cetaphil", logo: cetaphilLogo },
    ],
  },
  {
    name: "Vitamins",
    slug: "vitamins",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    description: "Supplements & wellness",
    brands: [],
  },
  {
    name: "Medicines",
    slug: "medicines",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    description: "OTC medicines & healthcare",
    brands: [],
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Browse our wide range of health and beauty products</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card 
                className="group overflow-hidden hover-elevate cursor-pointer"
                data-testid={`category-card-${category.slug}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-2">{category.description}</p>
                    {category.brands.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {category.brands.slice(0, 3).map((brand) => (
                          <div
                            key={brand.slug}
                            className="w-6 h-6 rounded-full overflow-hidden border border-white/30 bg-white"
                            title={brand.name}
                          >
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {category.brands.length > 3 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-white/20 text-white border-0 text-xs px-1.5"
                          >
                            +{category.brands.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
