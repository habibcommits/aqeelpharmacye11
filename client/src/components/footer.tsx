import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Phone, Mail, Clock, Lock, Award, Car, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdminAuth } from "@/lib/admin-auth-context";
import logoImage from "@assets/aqeelph_logo_1765266347695.png";

export function Footer() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (login(username, password)) {
      setOpen(false);
      setUsername("");
      setPassword("");
      setLocation("/admin");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img 
              src={logoImage} 
              alt="Aqeel Pharmacy" 
              className="h-14 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted pharmacy in Islamabad. We provide authentic skincare, haircare, 
              baby products, vitamins, and medicines with fast delivery.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a 
                href="https://maps.google.com/?q=Malik+Heights+Main+Double+Rd+Services+Society+MPCHS+E+11/2+E-11+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground hover:text-foreground">
                  Malik Heights, Main Double Rd, Services Society MPCHS E 11/2 E-11, Islamabad, 44000
                </span>
              </a>
              <a 
                href="tel:+923009109815"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground hover:text-foreground">+92 300 9109815</span>
              </a>
              <a 
                href="mailto:contact@aqeelpharmacy.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground hover:text-foreground">contact@aqeelpharmacy.com</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Open Daily: 7:00 AM - 3:00 AM</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Service Options:</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" size="sm" className="text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  Delivery
                </Badge>
                <Badge variant="secondary" size="sm" className="text-xs">
                  <Car className="w-3 h-3 mr-1" />
                  Drive-through
                </Badge>
                <Badge variant="secondary" size="sm" className="text-xs">
                  <Store className="w-3 h-3 mr-1" />
                  In-store
                </Badge>
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
            
            <div className="mt-6 pt-4 border-t border-border/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                License Info
              </h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>License #: <span className="font-medium">ISB-1687</span></p>
                <p>DHO ID: <span className="font-medium">DHO-IsB-1687</span></p>
                <p>Council Reg: <span className="font-medium">21336-A/2019</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Aqeel Pharmacy. All rights reserved. | Services Society, E-11/2, Islamabad
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Payment:</span>
              <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              
              {isAuthenticated ? (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" data-testid="button-admin-panel">
                    <Lock className="w-3 h-3 mr-1" />
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid="button-admin-login">
                      <Lock className="w-3 h-3 mr-1" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Admin Login</DialogTitle>
                      <DialogDescription>
                        Enter your credentials to access the admin panel.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                          data-testid="input-admin-username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          data-testid="input-admin-password"
                        />
                      </div>
                      {error && (
                        <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>
                      )}
                      <Button type="submit" className="w-full" data-testid="button-login-submit">
                        Login
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
