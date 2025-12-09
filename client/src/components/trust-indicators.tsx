import { Truck, Shield, RefreshCw, Clock, Car, Store, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over Rs 10,000",
  },
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Licensed pharmacy (ISB-1687)",
  },
  {
    icon: Clock,
    title: "Open 7 AM - 3 AM",
    description: "Open daily for you",
  },
  {
    icon: Car,
    title: "Drive-Through",
    description: "Quick pickup available",
  },
];

const serviceOptions = [
  { icon: Package, label: "Home Delivery" },
  { icon: Car, label: "Drive-Through" },
  { icon: Store, label: "In-Store Pickup" },
  { icon: Store, label: "In-Store Shopping" },
];

export function TrustIndicators() {
  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-0 bg-transparent shadow-none"
              data-testid={`trust-feature-${index}`}
            >
              <CardContent className="flex flex-col items-center text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/30">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Available Service Options</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {serviceOptions.map((service, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <service.icon className="w-4 h-4" />
                <span>{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
