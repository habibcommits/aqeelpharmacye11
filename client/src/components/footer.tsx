import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logoImage from "@assets/stock_images/pharmacy_logo_medica_fe9d3f91.jpg";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img 
              src={logoImage} 
              alt="AQeel Pharmacy" 
              className="h-14 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted online pharmacy in Pakistan. We provide authentic skincare, haircare, 
              baby products, vitamins, and medicines with fast delivery.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Commercial Market, Rawalpindi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">info@aqeelpharmacy.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Mon - Sat: 9:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/category/skin-care" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-skincare">
                Skin Care
              </Link>
              <Link href="/category/hair-care" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-haircare">
                Hair Care
              </Link>
              <Link href="/category/makeup" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-makeup">
                Makeup
              </Link>
              <Link href="/category/fragrance" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-fragrance">
                Fragrance
              </Link>
              <Link href="/category/baby" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-baby">
                Baby Care
              </Link>
              <Link href="/category/vitamins" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-vitamins">
                Vitamins & Supplements
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-products">
                All Products
              </Link>
              <Link href="/brands" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-brands">
                Brands
              </Link>
              <Link href="/track-order" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-track">
                Track Order
              </Link>
              <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-account">
                My Account
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Policies</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/policies/refund" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-refund">
                Refund Policy
              </Link>
              <Link href="/policies/exchange" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-exchange">
                Exchange Policy
              </Link>
              <Link href="/policies/privacy" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-privacy">
                Privacy Policy
              </Link>
              <Link href="/policies/terms" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-terms">
                Terms & Conditions
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 AQeel Pharmacy. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Payment:</span>
              <span className="text-sm font-medium">Cash on Delivery (COD)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
