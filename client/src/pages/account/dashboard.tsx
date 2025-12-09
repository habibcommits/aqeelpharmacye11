import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { 
  Package, 
  User, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail,
  Loader2,
  ShoppingBag,
  ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/lib/client-auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { clientProfileSchema, type OrderWithItems, type ClientProfileData } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function AccountDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { client, logout, updateClient, isAuthenticated } = useClientAuth();
  const [activeTab, setActiveTab] = useState("orders");

  const { data: orders, isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/client", client?.id, "orders"],
    enabled: !!client?.id,
  });

  const form = useForm<ClientProfileData>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      name: client?.name || undefined,
      phone: client?.phone || undefined,
      address: client?.address || undefined,
      city: client?.city || undefined,
      postalCode: client?.postalCode || undefined,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ClientProfileData) => {
      const response = await apiRequest("PATCH", `/api/client/${client?.id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      updateClient(data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client", client?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation("/");
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  const handleProfileSubmit = (data: ClientProfileData) => {
    updateProfileMutation.mutate(data);
  };

  useEffect(() => {
    if (!isAuthenticated || !client) {
      setLocation("/account/login");
    }
  }, [isAuthenticated, client, setLocation]);

  if (!isAuthenticated || !client) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            My Account
          </h1>
          <p className="text-muted-foreground" data-testid="text-email">
            {client.email}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="orders" data-testid="tab-orders">
            <Package className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="profile" data-testid="tab-profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>
                View all your previous orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover-elevate cursor-pointer"
                      data-testid={`card-order-${order.orderNumber}`}
                      onClick={() => setLocation(`/track-order?order=${order.orderNumber}`)}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                          <span className="font-semibold" data-testid={`text-order-number-${order.orderNumber}`}>
                            {order.orderNumber}
                          </span>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                        <Badge className={statusColors[order.status] || ""}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <span className="text-muted-foreground">
                              {item.productName.slice(0, 25)}
                              {item.productName.length > 25 ? "..." : ""}
                              {" x"}
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-muted-foreground">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Rs. {order.total.toLocaleString()}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start shopping to see your orders here!
                  </p>
                  <Button onClick={() => setLocation("/products")} data-testid="button-start-shopping">
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Details
              </CardTitle>
              <CardDescription>
                Update your personal information and delivery address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="Your name"
                                className="pl-10"
                                data-testid="input-name"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="03XX-XXXXXXX"
                                className="pl-10"
                                data-testid="input-phone"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Street address"
                              className="pl-10"
                              data-testid="input-address"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="City"
                              data-testid="input-city"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Postal code"
                              data-testid="input-postal-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              <Separator className="my-6" />

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Account Email</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
