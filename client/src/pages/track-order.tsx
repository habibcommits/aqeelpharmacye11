import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch, Link } from "wouter";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { OrderWithItems, OrderStatus } from "@shared/schema";

const statusConfig: Record<OrderStatus, { icon: typeof Package; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-500", label: "Pending" },
  processing: { icon: Package, color: "bg-blue-500", label: "Processing" },
  shipped: { icon: Truck, color: "bg-purple-500", label: "Shipped" },
  completed: { icon: CheckCircle, color: "bg-green-500", label: "Completed" },
  cancelled: { icon: XCircle, color: "bg-red-500", label: "Cancelled" },
};

const statusSteps: OrderStatus[] = ["pending", "processing", "shipped", "completed"];

export default function TrackOrderPage() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [searchedOrderNumber, setSearchedOrderNumber] = useState(initialOrderNumber);

  const { data: order, isLoading, error } = useQuery<OrderWithItems>({
    queryKey: ["/api/orders", searchedOrderNumber],
    enabled: !!searchedOrderNumber,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearchedOrderNumber(orderNumber.trim());
    }
  };

  const currentStatusIndex = order ? statusSteps.indexOf(order.status as OrderStatus) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">Enter your order number to track its status</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderNumber" className="sr-only">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="Enter order number (e.g., ORD-123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  data-testid="input-order-number"
                />
              </div>
              <Button type="submit" disabled={!orderNumber.trim()} data-testid="button-track">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && searchedOrderNumber && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Looking up your order...</p>
            </CardContent>
          </Card>
        )}

        {error && !isLoading && searchedOrderNumber && (
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground">
                We couldn't find an order with number "{searchedOrderNumber}"
              </p>
            </CardContent>
          </Card>
        )}

        {order && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order #{order.orderNumber}
                  </CardTitle>
                  <Badge
                    className={`${statusConfig[order.status as OrderStatus]?.color || "bg-gray-500"} text-white`}
                    data-testid="badge-status"
                  >
                    {statusConfig[order.status as OrderStatus]?.label || order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!isCancelled && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      {statusSteps.map((status, index) => {
                        const config = statusConfig[status];
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        
                        return (
                          <div key={status} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                isCompleted ? config.color : "bg-muted"
                              } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                            >
                              <config.icon className={`w-5 h-5 ${isCompleted ? "text-white" : "text-muted-foreground"}`} />
                            </div>
                            <span className={`text-xs text-center ${isCompleted ? "font-medium" : "text-muted-foreground"}`}>
                              {config.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="relative h-1 bg-muted rounded-full">
                      <div
                        className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(0, (currentStatusIndex / (statusSteps.length - 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">This order has been cancelled</span>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Payment Method</p>
                    <p className="font-medium">Cash on Delivery</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Shipping Address</p>
                    <p className="font-medium">{order.shippingAddress}</p>
                    <p className="text-muted-foreground">{order.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Total Amount</p>
                    <p className="font-bold text-lg" data-testid="text-track-total">Rs.{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items in Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4" data-testid={`track-item-${item.id}`}>
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.productImage || "https://via.placeholder.com/56"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/" data-testid="link-home">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        )}

        {!searchedOrderNumber && !isLoading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter your order number above to track your order</p>
          </div>
        )}
      </div>
    </div>
  );
}
