import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Minus, Plus, ShoppingCart, ChevronLeft, Check, Shield, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductGrid } from "@/components/product-grid";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@shared/schema";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", slug],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!product?.categoryId,
  });
  
  const relatedProducts = allProducts.filter(p => p.categoryId === product?.categoryId && p.id !== product?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-md" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["https://via.placeholder.com/600x600?text=No+Image"];
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/products" data-testid="link-back">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-main-product"
              />
              {discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4 text-base">
                  -{discount}%
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg py-2 px-4">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.brandId && (
              <Badge variant="secondary" className="mb-2" data-testid="badge-brand">
                Brand
              </Badge>
            )}
            <h1 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-product-name">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold" data-testid="text-product-price">
                Rs.{product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-muted-foreground line-through" data-testid="text-compare-price">
                  Rs.{product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.stock !== null && product.stock > 0 && product.stock <= 10 && (
              <Badge variant="outline" className="mb-4 text-destructive border-destructive">
                Only {product.stock} left in stock
              </Badge>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-qty"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock !== null && quantity >= product.stock}
                  data-testid="button-increase-qty"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center text-center p-3 bg-card rounded-md">
                <Shield className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-card rounded-md">
                <Truck className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Free Delivery 10k+</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-card rounded-md">
                <RefreshCw className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">7-Day Returns</span>
              </div>
            </div>

            <Separator className="my-6" />

            <Accordion type="single" collapsible defaultValue="description">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                    {product.description || "No description available for this product."}
                  </p>
                </AccordionContent>
              </AccordionItem>
              {product.weight && (
                <AccordionItem value="details">
                  <AccordionTrigger>Product Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight/Size</span>
                        <span>{product.weight}</span>
                      </div>
                      {product.sku && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SKU</span>
                          <span>{product.sku}</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Free delivery on orders over Rs 10,000</p>
                    <p>Standard delivery: 3-5 business days</p>
                    <p>7-day exchange and return policy for unused items</p>
                    <p>Cash on Delivery (COD) available</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <Separator className="mb-8" />
            <ProductGrid
              products={relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)}
              title="Related Products"
              subtitle="You might also like"
            />
          </section>
        )}
      </div>
    </div>
  );
}
