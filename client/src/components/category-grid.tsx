import { Link } from "wouter";
import { Card } from "@/components/ui/card";

const categories = [
  {
    name: "Skin Care",
    slug: "skin-care",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
    description: "Cleansers, moisturizers & more",
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop",
    description: "Shampoos, serums & treatments",
  },
  {
    name: "Makeup",
    slug: "makeup",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    description: "Lipsticks, foundations & palettes",
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    description: "Perfumes & body mists",
  },
  {
    name: "Sunscreen",
    slug: "sunscreen",
    image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400&h=400&fit=crop",
    description: "SPF protection for all skin types",
  },
  {
    name: "Baby Care",
    slug: "baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    description: "Gentle care for little ones",
  },
  {
    name: "Vitamins",
    slug: "vitamins",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    description: "Supplements & wellness",
  },
  {
    name: "Medicines",
    slug: "medicines",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    description: "OTC medicines & healthcare",
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.description}</p>
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
