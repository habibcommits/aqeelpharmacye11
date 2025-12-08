import { useParams, Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const policies: Record<string, { title: string; content: string[] }> = {
  refund: {
    title: "Refund Policy",
    content: [
      "At AQeel Pharmacy, we are committed to ensuring your satisfaction with every purchase. If you are not completely satisfied with your order, we're here to help.",
      "Eligibility for Refunds:",
      "• Products must be returned within 7 days of delivery",
      "• Items must be unused, unopened, and in their original packaging",
      "• Medicines and pharmaceutical products cannot be returned due to health and safety regulations",
      "• Skincare and beauty products that have been opened or used are not eligible for refund",
      "Refund Process:",
      "• Contact our customer support team with your order number and reason for return",
      "• Our team will review your request within 24-48 hours",
      "• If approved, you will receive instructions on how to return the item",
      "• Refunds will be processed within 5-7 business days after we receive the returned item",
      "• Refunds will be issued to the original payment method or as store credit",
      "Non-Refundable Items:",
      "• Opened or used products",
      "• Products damaged by the customer",
      "• Items purchased on sale or with discount codes",
      "• Prescription medications",
      "For any questions regarding refunds, please contact us at info@aqeelpharmacy.com or call our customer support line.",
    ],
  },
  exchange: {
    title: "Exchange Policy",
    content: [
      "We understand that sometimes you may need to exchange a product. AQeel Pharmacy offers a hassle-free exchange policy for eligible items.",
      "Exchange Eligibility:",
      "• Items must be exchanged within 7 days of delivery",
      "• Products must be in their original, unopened condition with all packaging intact",
      "• Exchange is available for the same product in a different variant or a different product of equal or greater value",
      "Exchange Process:",
      "• Contact our customer service with your order details and exchange request",
      "• Our team will confirm product availability and provide exchange options",
      "• If exchanging for a higher-priced item, you will need to pay the difference",
      "• If exchanging for a lower-priced item, the difference will be provided as store credit",
      "• Once approved, we will arrange for pickup of the original item and delivery of the exchanged product",
      "Items Not Eligible for Exchange:",
      "• Opened or used products",
      "• Medicines and pharmaceutical products",
      "• Products damaged by customer misuse",
      "• Items purchased during special promotions",
      "Please note that exchanges are subject to product availability. We will do our best to accommodate your request.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    content: [
      "AQeel Pharmacy respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.",
      "Information We Collect:",
      "• Personal information (name, email, phone number, address) when you place an order",
      "• Payment information for processing transactions",
      "• Browsing behavior and preferences on our website",
      "• Communication history with our customer support team",
      "How We Use Your Information:",
      "• To process and fulfill your orders",
      "• To communicate order updates and delivery information",
      "• To provide customer support and respond to inquiries",
      "• To send promotional emails (with your consent)",
      "• To improve our website and services",
      "Data Protection:",
      "• We use industry-standard encryption to protect your personal data",
      "• Your payment information is processed through secure payment gateways",
      "• We do not sell or share your personal information with third parties for marketing purposes",
      "• Access to your data is restricted to authorized personnel only",
      "Your Rights:",
      "• You can request access to your personal data at any time",
      "• You can request correction or deletion of your data",
      "• You can opt-out of promotional communications",
      "For privacy-related inquiries, please contact us at privacy@aqeelpharmacy.com",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    content: [
      "Welcome to AQeel Pharmacy. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions.",
      "General Terms:",
      "• You must be at least 18 years old to make purchases on our website",
      "• All product information, prices, and availability are subject to change without notice",
      "• We reserve the right to refuse service to anyone for any reason",
      "• Product images are for illustration purposes and may differ from actual products",
      "Orders and Payment:",
      "• All orders are subject to acceptance and availability",
      "• We currently accept Cash on Delivery (COD) only",
      "• Prices are displayed in Pakistani Rupees (PKR) and include applicable taxes",
      "• Orders may be cancelled if payment is not received or if there are stock issues",
      "Delivery:",
      "• We deliver across Pakistan",
      "• Delivery times vary based on location and are estimates only",
      "• Free delivery is available on orders above Rs 10,000",
      "• Shipping charges apply for orders below Rs 10,000",
      "• We are not responsible for delays caused by factors beyond our control",
      "Limitation of Liability:",
      "• AQeel Pharmacy is not liable for any indirect, incidental, or consequential damages",
      "• Our liability is limited to the purchase price of the products ordered",
      "• We do not provide medical advice; consult a healthcare professional before using any products",
      "Intellectual Property:",
      "• All content on this website is owned by AQeel Pharmacy",
      "• You may not reproduce, distribute, or use our content without permission",
      "By using our website, you acknowledge that you have read, understood, and agree to these terms.",
    ],
  },
};

export default function PoliciesPage() {
  const { type } = useParams<{ type: string }>();
  const policy = policies[type];

  if (!policy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Policy Not Found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/" data-testid="link-back-home">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl" data-testid="text-policy-title">
              {policy.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            {policy.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground mb-4">
                {paragraph}
              </p>
            ))}
            <p className="text-sm text-muted-foreground mt-8 pt-4 border-t">
              Last updated: December 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
