import { Link } from "wouter";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@shared/schema";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const isInCart = items.some(item => item.productId === product.id);
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const primaryImage = product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <Link href={`/product/${product.slug}`}>
      <Card 
        className="group overflow-visible hover-elevate cursor-pointer h-full"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-md bg-muted">
          <img
            src={primaryImage}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            data-testid={`img-product-${product.id}`}
          />
          {discount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 right-2"
              data-testid={`badge-discount-${product.id}`}
            >
              -{discount}%
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 md:p-4">
          {product.brandId && (
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide" data-testid={`text-brand-${product.id}`}>
              Brand
            </p>
          )}
          <h3 
            className="font-medium text-sm md:text-base line-clamp-2 mb-2 min-h-[2.5rem]"
            data-testid={`text-name-${product.id}`}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span 
                className="font-bold text-lg"
                data-testid={`text-price-${product.id}`}
              >
                Rs.{product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span 
                  className="text-xs text-muted-foreground line-through"
                  data-testid={`text-compare-price-${product.id}`}
                >
                  Rs.{product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            <Button
              size="icon"
              variant={justAdded || isInCart ? "secondary" : "default"}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-testid={`button-add-${product.id}`}
            >
              {justAdded || isInCart ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
