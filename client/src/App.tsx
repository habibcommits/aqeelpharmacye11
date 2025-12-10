import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { ClientAuthProvider } from "@/lib/client-auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AdminLayout } from "@/components/admin-layout";

import HomePage from "@/pages/home";
import ProductsPage from "@/pages/products";
import ProductDetailPage from "@/pages/product-detail";
import CategoryPage from "@/pages/category";
import BrandsPage from "@/pages/brands";
import CheckoutPage from "@/pages/checkout";
import OrderConfirmationPage from "@/pages/order-confirmation";
import TrackOrderPage from "@/pages/track-order";
import PoliciesPage from "@/pages/policies";
import NotFound from "@/pages/not-found";

import AccountLogin from "@/pages/account/login";
import AccountDashboard from "@/pages/account/dashboard";

import AdminDashboard from "@/pages/admin/index";
import AdminProducts from "@/pages/admin/products";
import AdminProductForm from "@/pages/admin/product-form";
import AdminOrders from "@/pages/admin/orders";
import AdminBrands from "@/pages/admin/brands";
import AdminImport from "@/pages/admin/import";
import AdminNajeebImport from "@/pages/admin/najeeb-import";
import AdminDWatsonImport from "@/pages/admin/dwatson-import";

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <StorefrontLayout>
          <HomePage />
        </StorefrontLayout>
      </Route>
      <Route path="/products">
        <StorefrontLayout>
          <ProductsPage />
        </StorefrontLayout>
      </Route>
      <Route path="/product/:slug">
        <StorefrontLayout>
          <ProductDetailPage />
        </StorefrontLayout>
      </Route>
      <Route path="/category/:slug">
        <StorefrontLayout>
          <CategoryPage />
        </StorefrontLayout>
      </Route>
      <Route path="/brands">
        <StorefrontLayout>
          <BrandsPage />
        </StorefrontLayout>
      </Route>
      <Route path="/checkout">
        <StorefrontLayout>
          <CheckoutPage />
        </StorefrontLayout>
      </Route>
      <Route path="/order-confirmation/:orderNumber">
        <StorefrontLayout>
          <OrderConfirmationPage />
        </StorefrontLayout>
      </Route>
      <Route path="/track-order">
        <StorefrontLayout>
          <TrackOrderPage />
        </StorefrontLayout>
      </Route>
      <Route path="/policies/:type">
        <StorefrontLayout>
          <PoliciesPage />
        </StorefrontLayout>
      </Route>

      <Route path="/account/login">
        <StorefrontLayout>
          <AccountLogin />
        </StorefrontLayout>
      </Route>
      <Route path="/account">
        <StorefrontLayout>
          <AccountDashboard />
        </StorefrontLayout>
      </Route>
      
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/products">
        <AdminLayout>
          <AdminProducts />
        </AdminLayout>
      </Route>
      <Route path="/admin/products/new">
        <AdminLayout>
          <AdminProductForm />
        </AdminLayout>
      </Route>
      <Route path="/admin/products/:id">
        <AdminLayout>
          <AdminProductForm />
        </AdminLayout>
      </Route>
      <Route path="/admin/orders">
        <AdminLayout>
          <AdminOrders />
        </AdminLayout>
      </Route>
      <Route path="/admin/brands">
        <AdminLayout>
          <AdminBrands />
        </AdminLayout>
      </Route>
      <Route path="/admin/import">
        <AdminLayout>
          <AdminImport />
        </AdminLayout>
      </Route>
      <Route path="/admin/najeeb-import">
        <AdminLayout>
          <AdminNajeebImport />
        </AdminLayout>
      </Route>
      <Route path="/admin/dwatson-import">
        <AdminLayout>
          <AdminDWatsonImport />
        </AdminLayout>
      </Route>

      <Route>
        <StorefrontLayout>
          <NotFound />
        </StorefrontLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminAuthProvider>
          <ClientAuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </CartProvider>
          </ClientAuthProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
