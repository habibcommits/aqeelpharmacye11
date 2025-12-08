import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";
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
    description: "Genuine products only",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "7-day exchange policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
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
      </div>
    </section>
  );
}
