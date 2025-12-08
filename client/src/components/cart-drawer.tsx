import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotal, isOpen, setIsOpen } = useCart();
  const total = getTotal();
  const freeShippingThreshold = 10000;
  const remainingForFreeShipping = freeShippingThreshold - total;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <Button onClick={() => setIsOpen(false)} asChild>
              <Link href="/products" data-testid="link-continue-shopping">
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {remainingForFreeShipping > 0 && (
              <div className="bg-secondary/50 rounded-md p-3 text-sm">
                Add <span className="font-semibold">Rs.{remainingForFreeShipping.toLocaleString()}</span> more for free delivery!
              </div>
            )}

            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-3"
                    data-testid={`cart-item-${item.productId}`}
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images?.[0] || "https://via.placeholder.com/80"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm font-semibold mb-2">
                        Rs.{item.product.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          data-testid={`button-decrease-${item.productId}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm" data-testid={`text-quantity-${item.productId}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          data-testid={`button-increase-${item.productId}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-muted-foreground"
                          onClick={() => removeItem(item.productId)}
                          data-testid={`button-remove-${item.productId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold" data-testid="text-subtotal">
                  Rs.{total.toLocaleString()}
                </span>
              </div>
              {total >= freeShippingThreshold ? (
                <div className="flex items-center justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold" data-testid="text-total">
                  Rs.{total.toLocaleString()}
                </span>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/checkout" data-testid="button-checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/products" data-testid="button-continue-shopping">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
