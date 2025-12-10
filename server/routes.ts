import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import * as cheerio from "cheerio";
import { storage } from "./storage";
import { insertProductSchema, insertBrandSchema, insertCategorySchema, checkoutFormSchema, clientLoginSchema, otpVerifySchema, clientProfileSchema } from "@shared/schema";
import { generateOtp, getOtpExpiryTime, sendOtpEmail } from "./email";
import { getImageKitAuthParams, uploadImage } from "./imagekit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/category/:slug", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProductsByCategory(req.params.slug);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:identifier", async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
      let product = await storage.getProduct(identifier);
      if (!product) {
        product = await storage.getProductBySlug(identifier);
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const result = insertCategorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }
      const category = await storage.createCategory(result.data);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  // Brands
  app.get("/api/brands", async (req: Request, res: Response) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:slug", async (req: Request, res: Response) => {
    try {
      const brand = await storage.getBrandBySlug(req.params.slug);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand" });
    }
  });

  app.post("/api/brands", async (req: Request, res: Response) => {
    try {
      const result = insertBrandSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }
      const brand = await storage.createBrand(result.data);
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to create brand" });
    }
  });

  app.patch("/api/brands/:id", async (req: Request, res: Response) => {
    try {
      const brand = await storage.updateBrand(req.params.id, req.body);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to update brand" });
    }
  });

  app.delete("/api/brands/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteBrand(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });

  // Orders
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:orderNumber", async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { items, ...orderData } = req.body;
      
      const result = checkoutFormSchema.safeParse(orderData);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order must have at least one item" });
      }

      const order = await storage.createOrder(
        {
          ...result.data,
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost,
          total: orderData.total,
          status: "pending",
          paymentMethod: "cod",
        },
        items.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity,
        }))
      );

      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Banners
  app.get("/api/banners", async (req: Request, res: Response) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  // ImageKit Authentication
  app.get("/api/imagekit/auth", async (req: Request, res: Response) => {
    try {
      const authParams = getImageKitAuthParams();
      res.json(authParams);
    } catch (error) {
      console.error("ImageKit auth error:", error);
      res.status(500).json({ error: "Failed to generate ImageKit auth parameters" });
    }
  });

  // ImageKit Upload - accepts base64 image data
  app.post("/api/imagekit/upload", async (req: Request, res: Response) => {
    try {
      const { file, fileName, folder = "products" } = req.body;
      
      if (!file || !fileName) {
        return res.status(400).json({ error: "File and fileName are required" });
      }

      const result = await uploadImage(file, fileName, folder);
      res.json(result);
    } catch (error) {
      console.error("ImageKit upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Client Authentication
  app.post("/api/auth/send-otp", async (req: Request, res: Response) => {
    try {
      const result = clientLoginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const { email } = result.data;
      
      await storage.cleanupExpiredOtps();
      
      const existingClient = await storage.getClientByEmail(email);
      const isExistingUser = !!existingClient;
      
      const otp = generateOtp();
      const expiresAt = getOtpExpiryTime();
      
      await storage.createOtp({ email, otp, expiresAt });
      
      const sent = await sendOtpEmail(email, otp);
      
      if (!sent) {
        return res.status(500).json({ error: "Failed to send verification email. Please try again." });
      }

      res.json({ 
        success: true, 
        message: "Verification code sent to your email",
        isExistingUser
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
    try {
      const result = otpVerifySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const { email, otp } = result.data;
      
      const validOtp = await storage.getValidOtp(email, otp);
      
      if (!validOtp) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }

      await storage.markOtpAsUsed(validOtp.id);
      
      let client = await storage.getClientByEmail(email);
      const isNewUser = !client;
      
      if (!client) {
        client = await storage.createClient({ email });
      }

      res.json({ 
        success: true, 
        isNewUser,
        client: {
          id: client.id,
          email: client.email,
          name: client.name,
          phone: client.phone,
          address: client.address,
          city: client.city,
          postalCode: client.postalCode,
        }
      });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  app.get("/api/client/:id", async (req: Request, res: Response) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json({
        id: client.id,
        email: client.email,
        name: client.name,
        phone: client.phone,
        address: client.address,
        city: client.city,
        postalCode: client.postalCode,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.patch("/api/client/:id", async (req: Request, res: Response) => {
    try {
      const result = clientProfileSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const filteredData: Record<string, string> = {};
      for (const [key, value] of Object.entries(result.data)) {
        if (value !== undefined && value !== null && value !== "") {
          filteredData[key] = value;
        }
      }

      const client = await storage.updateClient(req.params.id, filteredData);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json({
        id: client.id,
        email: client.email,
        name: client.name,
        phone: client.phone,
        address: client.address,
        city: client.city,
        postalCode: client.postalCode,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/client/:id/orders", async (req: Request, res: Response) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      const orders = await storage.getOrdersByClientEmail(client.email);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Brand Import - Scrapes brands from partner website
  app.post("/api/admin/import-brands", async (req: Request, res: Response) => {
    try {
      const { url, deleteExisting = false } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const importedBrands: Array<{
        name: string;
        logo: string;
        status: "success" | "error" | "skipped";
        error?: string;
      }> = [];

      // Delete existing brands if requested
      if (deleteExisting) {
        const existingBrands = await storage.getBrands();
        for (const brand of existingBrands) {
          await storage.deleteBrand(brand.id);
        }
      }

      // Get existing brands to avoid duplicates
      const existingBrands = await storage.getBrands();
      const existingSlugs = new Set(existingBrands.map(b => b.slug.toLowerCase()));

      // Fetch the brands page
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 60000
      });

      const $ = cheerio.load(response.data);

      const brandElements: Array<{ name: string; logo: string }> = [];

      // Detect source from URL
      const hostname = new URL(url).hostname.toLowerCase();
      const isNajeeb = hostname.includes("najeeb");
      const isDWatson = hostname.includes("dwatson");

      // Pattern for Najeeb Pharmacy brands page
      if (isNajeeb) {
        $('a[href*="?brand="]').each((_, el) => {
          const $el = $(el);
          const href = $el.attr('href') || '';
          const brandParam = new URLSearchParams(href.split('?')[1]).get('brand');
          const name = brandParam || $el.text().trim();
          if (name && name.length > 1 && !name.includes('All')) {
            brandElements.push({ name, logo: '' });
          }
        });
        
        // Also check for brand links in different format
        if (brandElements.length === 0) {
          $('a').each((_, el) => {
            const $el = $(el);
            const href = $el.attr('href') || '';
            if (href.includes('brand=')) {
              const name = $el.text().trim();
              if (name && name.length > 1 && !name.toLowerCase().includes('all')) {
                brandElements.push({ name, logo: '' });
              }
            }
          });
        }
      }

      // Pattern for D.Watson brands
      if (isDWatson && brandElements.length === 0) {
        $('.brand-name, .brand-item, .brands a').each((_, el) => {
          const $el = $(el);
          const name = $el.text().trim();
          const logo = $el.find('img').attr('src') || '';
          if (name && name.length > 1) {
            brandElements.push({ name, logo });
          }
        });
      }

      // Generic Pattern 1: Links with brand images 
      if (brandElements.length === 0) {
        $('a[href*="/collections/"], a[href*="/brand/"], a[href*="brand="]').each((_, el) => {
          const $el = $(el);
          const img = $el.find('img');
          if (img.length > 0) {
            const name = img.attr('alt') || $el.text().trim();
            const logo = img.attr('src') || '';
            if (name && name.length > 1) {
              brandElements.push({ name, logo });
            }
          } else {
            const name = $el.text().trim();
            if (name && name.length > 1 && !name.toLowerCase().includes('all')) {
              brandElements.push({ name, logo: '' });
            }
          }
        });
      }

      // Generic Pattern 2: Standalone images with brand names
      if (brandElements.length === 0) {
        $('img[alt]').each((_, el) => {
          const $el = $(el);
          const name = $el.attr('alt') || '';
          const logo = $el.attr('src') || '';
          const parent = $el.closest('a');
          const parentHref = parent.attr('href') || '';
          if (name && logo && (parentHref.includes('/collections/') || parentHref.includes('/brand/') || parentHref.includes('brand='))) {
            brandElements.push({ name, logo });
          }
        });
      }

      // Generic Pattern 3: Brand cards
      if (brandElements.length === 0) {
        $('.brand, .brand-item, .brand-card, [data-brand], .manufacturer, .vendor').each((_, el) => {
          const $el = $(el);
          const name = $el.find('h2, h3, h4, .brand-name, .title, .name').text().trim() || $el.text().trim();
          const logo = $el.find('img').attr('src') || '';
          if (name && name.length > 1) {
            brandElements.push({ name, logo });
          }
        });
      }

      // Generic Pattern 4: List items that look like brands
      if (brandElements.length === 0) {
        $('ul.brands li, .brand-list li, .manufacturer-list li').each((_, el) => {
          const $el = $(el);
          const name = $el.find('a').text().trim() || $el.text().trim();
          if (name && name.length > 1) {
            brandElements.push({ name, logo: '' });
          }
        });
      }

      if (brandElements.length === 0) {
        return res.json({
          success: false,
          imported: 0,
          skipped: 0,
          failed: 0,
          brands: [],
          message: "No brands found on the page. The website structure may not be supported."
        });
      }

      // Deduplicate by name
      const uniqueBrands = new Map<string, { name: string; logo: string }>();
      for (const brand of brandElements) {
        const normalizedName = brand.name.trim();
        if (normalizedName && !uniqueBrands.has(normalizedName.toLowerCase())) {
          uniqueBrands.set(normalizedName.toLowerCase(), brand);
        }
      }

      let imported = 0;
      let skipped = 0;
      let failed = 0;

      for (const [, brand] of uniqueBrands) {
        const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        
        // Check if brand already exists
        if (existingSlugs.has(slug)) {
          importedBrands.push({
            name: brand.name,
            logo: brand.logo,
            status: "skipped",
            error: "Brand already exists"
          });
          skipped++;
          continue;
        }

        try {
          await storage.createBrand({
            name: brand.name,
            slug,
            logo: brand.logo,
            description: null,
          });

          existingSlugs.add(slug);
          importedBrands.push({
            name: brand.name,
            logo: brand.logo,
            status: "success"
          });
          imported++;
        } catch (error) {
          importedBrands.push({
            name: brand.name,
            logo: brand.logo,
            status: "error",
            error: error instanceof Error ? error.message : "Failed to create brand"
          });
          failed++;
        }
      }

      res.json({
        success: true,
        imported,
        skipped,
        failed,
        brands: importedBrands,
        message: `Imported ${imported} brands, skipped ${skipped} duplicates, ${failed} failed`
      });

    } catch (error) {
      console.error("Brand import error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to import brands"
      });
    }
  });

  // Product Import - Scrapes products from partner website
  app.post("/api/admin/import-products", async (req: Request, res: Response) => {
    try {
      const { url, maxProducts = 20 } = req.body;
      
      const importedProducts: Array<{
        name: string;
        price: number;
        image: string;
        status: "success" | "error";
        error?: string;
      }> = [];
      
      let failed = 0;

      // Get existing categories to match products
      const existingCategories = await storage.getCategories();
      
      // Category keyword mappings
      const categoryKeywords: Record<string, string[]> = {
        "skin-care": ["skin", "face", "cleanser", "moisturizer", "serum", "cream", "lotion", "facial", "acne", "anti-aging", "skincare"],
        "hair-care": ["hair", "shampoo", "conditioner", "scalp", "dandruff", "hairfall", "keratin"],
        "makeup": ["makeup", "lipstick", "foundation", "mascara", "eyeshadow", "concealer", "blush", "primer"],
        "fragrance": ["perfume", "fragrance", "cologne", "body spray", "mist", "attar", "scent"],
        "sunscreen": ["sunscreen", "spf", "sunblock", "sun protection", "uv"],
        "baby": ["baby", "infant", "kids", "child", "diaper", "newborn"],
        "vitamins": ["vitamin", "supplement", "multivitamin", "omega", "calcium", "iron", "zinc"],
        "medicines": ["medicine", "tablet", "capsule", "syrup", "paracetamol", "pain", "fever", "cold", "cough"],
      };

      // Function to detect category from product name/url
      const detectCategory = (productName: string, productUrl: string = ""): string | undefined => {
        const searchText = (productName + " " + productUrl).toLowerCase();
        
        for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
          for (const keyword of keywords) {
            if (searchText.includes(keyword.toLowerCase())) {
              const matchedCategory = existingCategories.find(c => c.slug === categorySlug);
              if (matchedCategory) {
                return matchedCategory.id;
              }
            }
          }
        }
        return undefined;
      };

      // Fetch the main page
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);

      // Look for product elements - common WooCommerce/WordPress patterns
      const productSelectors = [
        '.product',
        '.products .product',
        '.woocommerce-loop-product',
        '.product-item',
        '.product-card',
        'li.product',
        '.shop-product',
        '[data-product-id]'
      ];

      let products: ReturnType<typeof $> | null = null;
      for (const selector of productSelectors) {
        const found = $(selector);
        if (found.length > 0) {
          products = found;
          break;
        }
      }

      if (!products || products.length === 0) {
        const productLinks = $('a[href*="/product/"], a.woocommerce-LoopProduct-link');
        if (productLinks.length > 0) {
          products = productLinks.closest('li, div').filter((_, el) => $(el).find('img').length > 0);
        }
      }

      if (!products || products.length === 0) {
        return res.json({
          success: false,
          imported: 0,
          failed: 0,
          products: [],
          message: "No products found on the page. The website structure may not be supported."
        });
      }

      const productCount = Math.min(products.length, maxProducts);

      for (let i = 0; i < productCount; i++) {
        try {
          const productEl = $(products[i]);
          
          // Extract product URL for category detection
          const productUrl = productEl.find('a').first().attr('href') || '';
          
          // Extract product name
          const nameSelectors = ['.woocommerce-loop-product__title', '.product-title', '.product-name', 'h2', 'h3', '.title', 'a.product-link'];
          let name = '';
          for (const sel of nameSelectors) {
            const found = productEl.find(sel).first().text().trim();
            if (found) {
              name = found;
              break;
            }
          }
          if (!name) {
            name = productEl.find('a').first().text().trim() || `Product ${i + 1}`;
          }

          // Extract category from page structure
          let categoryFromPage = productEl.attr('data-category') || 
                                 productEl.find('[data-category]').attr('data-category') ||
                                 productEl.closest('[data-category]').attr('data-category') || '';
          
          // Try to get category from product classes
          const productClasses = productEl.attr('class') || '';
          const categoryMatch = productClasses.match(/product-cat-([a-z0-9-]+)/i);
          if (categoryMatch) {
            categoryFromPage = categoryMatch[1];
          }

          // Extract price
          const priceSelectors = ['.price ins .amount', '.price .amount', '.woocommerce-Price-amount', '.product-price', '.price'];
          let priceText = '';
          for (const sel of priceSelectors) {
            const found = productEl.find(sel).first().text().trim();
            if (found) {
              priceText = found;
              break;
            }
          }
          // Fix: Handle comma-separated prices like "3,250" or "Rs.3,250"
          // First remove currency symbols and spaces, then handle comma as thousands separator
          let cleanPrice = priceText
            .replace(/Rs\.?/gi, '')  // Remove Rs or Rs.
            .replace(/PKR/gi, '')     // Remove PKR
            .replace(/₹/g, '')        // Remove rupee symbol
            .replace(/\$/g, '')       // Remove dollar sign
            .replace(/\s/g, '')       // Remove whitespace
            .trim();
          
          // If price has comma followed by 3 digits, it's a thousands separator
          // If comma followed by 2 digits at the end, treat as decimal (European format)
          if (/,\d{3}/.test(cleanPrice)) {
            // Comma is thousands separator (e.g., "3,250" -> "3250")
            cleanPrice = cleanPrice.replace(/,/g, '');
          } else if (/,\d{2}$/.test(cleanPrice)) {
            // Comma is decimal separator (European format, e.g., "32,50" -> "32.50")
            cleanPrice = cleanPrice.replace(',', '.');
          }
          
          const price = parseFloat(cleanPrice) || 0;

          // Extract image
          const imgSelectors = ['img.wp-post-image', 'img.attachment-woocommerce_thumbnail', '.product-image img', 'img'];
          let image = '';
          for (const sel of imgSelectors) {
            const imgEl = productEl.find(sel).first();
            image = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || '';
            if (image) break;
          }
          
          if (image && !image.startsWith('http')) {
            const baseUrl = new URL(url);
            image = new URL(image, baseUrl.origin).toString();
          }

          if (name && price > 0) {
            const existingProducts = await storage.getProducts();
            const exists = existingProducts.some(p => p.name.toLowerCase() === name.toLowerCase());
            
            if (!exists) {
              // Detect category
              let categoryId = detectCategory(name, productUrl + " " + categoryFromPage);
              
              // If no category detected, try to match from URL path
              if (!categoryId && productUrl) {
                try {
                  const urlPath = new URL(productUrl, url).pathname.toLowerCase();
                  for (const cat of existingCategories) {
                    if (urlPath.includes(cat.slug) || urlPath.includes(cat.name.toLowerCase().replace(/\s+/g, '-'))) {
                      categoryId = cat.id;
                      break;
                    }
                  }
                } catch (e) {}
              }

              await storage.createProduct({
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
                description: `Imported from ${url}`,
                price,
                images: image ? [image] : [],
                categoryId: categoryId || undefined,
                isActive: true,
                isFeatured: false,
                stock: 20,
              });

              importedProducts.push({
                name,
                price,
                image: image || "https://via.placeholder.com/100",
                status: "success",
              });
            } else {
              failed++;
              importedProducts.push({
                name,
                price,
                image: image || "https://via.placeholder.com/100",
                status: "error",
                error: "Product already exists",
              });
            }
          }
        } catch (productError) {
          failed++;
        }
      }

      res.json({
        success: importedProducts.length > 0,
        imported: importedProducts.filter(p => p.status === "success").length,
        failed,
        products: importedProducts,
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ 
        error: "Failed to import products", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Najeeb Pharmacy Product Import - Scrapes products from najeebpharmacy.com
  app.post("/api/admin/import-najeeb", async (req: Request, res: Response) => {
    try {
      const { maxProducts = 50, startPage = 1, endPage = 1 } = req.body;
      
      const importedProducts: Array<{
        name: string;
        price: number;
        image: string;
        status: "success" | "error" | "skipped";
        error?: string;
      }> = [];
      
      let imported = 0;
      let failed = 0;
      let skipped = 0;

      // Get existing categories to match products
      const existingCategories = await storage.getCategories();
      const existingProducts = await storage.getProducts();
      const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));
      
      // Category keyword mappings for pharmaceuticals
      const categoryKeywords: Record<string, string[]> = {
        "skin-care": ["skin", "face", "cleanser", "moisturizer", "serum", "cream", "lotion", "facial", "acne", "derma"],
        "hair-care": ["hair", "shampoo", "conditioner", "scalp", "dandruff", "hairfall"],
        "vitamins": ["vitamin", "supplement", "multivitamin", "omega", "calcium", "iron", "zinc", "tablets"],
        "medicines": ["medicine", "tablet", "capsule", "syrup", "paracetamol", "pain", "fever", "cold", "cough", "mg", "drop", "injection", "gel", "ointment", "sachet"],
        "baby": ["baby", "infant", "kids", "child", "newborn"],
      };

      const detectCategory = (productName: string): string | undefined => {
        const searchText = productName.toLowerCase();
        
        for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
          for (const keyword of keywords) {
            if (searchText.includes(keyword.toLowerCase())) {
              const matchedCategory = existingCategories.find(c => c.slug === categorySlug);
              if (matchedCategory) {
                return matchedCategory.id;
              }
            }
          }
        }
        return existingCategories.find(c => c.slug === "medicines")?.id;
      };

      // Collect products from all pages
      const allProductData: Array<{name: string; price: number; image: string}> = [];
      
      for (let page = startPage; page <= endPage; page++) {
        const url = `https://www.najeebpharmacy.com/products?page=${page}`;
        
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
            },
            timeout: 60000
          });

          const $ = cheerio.load(response.data);

          // Method 1: Look for product cards with images and links
          $('a[href*="/products/"]').each((_, el) => {
            const $link = $(el);
            const href = $link.attr('href') || '';
            
            // Only process if it's a product detail link like /products/123
            if (!/\/products\/\d+$/.test(href)) return;
            
            // Find the text content - could be in h6 or direct text
            let name = $link.find('h6').text().trim() || $link.text().trim();
            if (!name || name.length < 2) return;
            
            // Find the parent card container
            let $card = $link.closest('.card, .product-card, .col, [class*="col-"]');
            if ($card.length === 0) {
              $card = $link.parent().parent().parent().parent();
            }
            
            // Extract price - look for Rs pattern in the card
            const cardText = $card.text();
            const priceMatch = cardText.match(/Rs\s*([\d,]+(?:\.\d{1,2})?)/i);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
            
            // Extract image - look for img with src containing api.najeebmart.com
            let image = '';
            $card.find('img').each((_, imgEl) => {
              const src = $(imgEl).attr('src') || '';
              if (src.includes('najeebmart.com') || src.includes('uploads')) {
                image = src.startsWith('http') ? src : `https://api.najeebmart.com${src.startsWith('/') ? '' : '/'}${src}`;
              }
            });
            
            if (!image) {
              const imgEl = $card.find('img').first();
              image = imgEl.attr('src') || '';
              if (image && !image.startsWith('http')) {
                image = `https://api.najeebmart.com${image.startsWith('/') ? '' : '/'}${image}`;
              }
            }
            
            allProductData.push({ name, price, image });
          });
          
          // Method 2: If method 1 found nothing for this page, try looking at h6 elements
          if (allProductData.length === 0) {
            $('h6').each((_, el) => {
              const $h6 = $(el);
              const $link = $h6.find('a[href*="/products/"]');
              if ($link.length === 0) return;
              
              const href = $link.attr('href') || '';
              if (!/\/products\/\d+$/.test(href)) return;
              
              const name = $link.text().trim();
              if (!name || name.length < 2) return;
              
              let $card = $h6.closest('.card, .product-card, .col, [class*="col-"]');
              if ($card.length === 0) {
                $card = $h6.parent().parent().parent();
              }
              
              const cardText = $card.text();
              const priceMatch = cardText.match(/Rs\s*([\d,]+(?:\.\d{1,2})?)/i);
              const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
              
              let image = '';
              $card.find('img[src*="najeebmart.com"], img[src*="uploads"]').each((_, imgEl) => {
                const src = $(imgEl).attr('src') || '';
                image = src.startsWith('http') ? src : `https://api.najeebmart.com${src.startsWith('/') ? '' : '/'}${src}`;
              });
              
              allProductData.push({ name, price, image });
            });
          }
          
          // Method 3: Find images with najeebmart.com src and use alt text
          if (allProductData.length === 0) {
            $('img[src*="najeebmart.com"], img[src*="uploads"]').each((_, el) => {
              const $img = $(el);
              const alt = $img.attr('alt') || '';
              const src = $img.attr('src') || '';
              
              if (!alt || alt.length < 3) return;
              
              let $card = $img.closest('.card, .product-card, .col, [class*="col-"]');
              if ($card.length === 0) {
                $card = $img.parent().parent().parent();
              }
              
              const cardText = $card.text();
              const priceMatch = cardText.match(/Rs\s*([\d,]+(?:\.\d{1,2})?)/i);
              const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
              
              const image = src.startsWith('http') ? src : `https://api.najeebmart.com${src.startsWith('/') ? '' : '/'}${src}`;
              
              allProductData.push({ name: alt, price, image });
            });
          }
        } catch (pageError) {
          console.error(`Failed to fetch page ${page}:`, pageError);
        }
      }

      // Deduplicate by name
      const seen = new Set<string>();
      const uniqueProducts = allProductData.filter(p => {
        const key = p.name.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const productsToProcess = uniqueProducts.slice(0, maxProducts);

      for (const product of productsToProcess) {
        try {
          const { name, price, image } = product;
          
          // Check for duplicates in database
          if (existingNames.has(name.toLowerCase().trim())) {
            importedProducts.push({
              name,
              price,
              image,
              status: "skipped",
              error: "Product already exists"
            });
            skipped++;
            continue;
          }

          if (name && price > 0) {
            const categoryId = detectCategory(name);
            
            await storage.createProduct({
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
              description: `Imported from Najeeb Pharmacy`,
              price,
              images: image ? [image] : [],
              categoryId: categoryId || undefined,
              isActive: true,
              isFeatured: false,
              stock: 20,
            });

            existingNames.add(name.toLowerCase().trim());
            importedProducts.push({
              name,
              price,
              image: image || "https://via.placeholder.com/100",
              status: "success",
            });
            imported++;
          } else if (name) {
            importedProducts.push({
              name,
              price,
              image: image || "",
              status: "error",
              error: price <= 0 ? "Invalid price" : "Missing data"
            });
            failed++;
          }
        } catch (productError) {
          failed++;
        }
      }

      res.json({
        success: imported > 0 || skipped > 0,
        imported,
        failed,
        skipped,
        products: importedProducts,
        message: allProductData.length === 0 ? "Najeeb Pharmacy may have changed their page structure. Try the general Import page instead." : undefined
      });
    } catch (error) {
      console.error("Najeeb import error:", error);
      res.status(500).json({ 
        error: "Failed to import products from Najeeb Pharmacy", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // D.Watson Pharmacy Product Import - Scrapes products from dwatson.pk
  app.post("/api/admin/import-dwatson", async (req: Request, res: Response) => {
    try {
      const { maxProducts = 50, startPage = 1, endPage = 1 } = req.body;
      
      const importedProducts: Array<{
        name: string;
        price: number;
        image: string;
        brand?: string;
        status: "success" | "error" | "skipped";
        error?: string;
      }> = [];
      
      let imported = 0;
      let failed = 0;
      let skipped = 0;

      // Get existing categories to match products
      const existingCategories = await storage.getCategories();
      const existingProducts = await storage.getProducts();
      const existingBrands = await storage.getBrands();
      const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));
      
      // Category keyword mappings for pharmaceuticals
      const categoryKeywords: Record<string, string[]> = {
        "skin-care": ["skin", "face", "cleanser", "moisturizer", "serum", "cream", "lotion", "facial", "acne", "derma"],
        "hair-care": ["hair", "shampoo", "conditioner", "scalp", "dandruff", "hairfall"],
        "vitamins": ["vitamin", "supplement", "multivitamin", "omega", "calcium", "iron", "zinc", "tablets"],
        "medicines": ["medicine", "tablet", "capsule", "syrup", "paracetamol", "pain", "fever", "cold", "cough", "mg", "drop", "injection", "gel", "ointment", "sachet", "susp", "inj"],
        "baby": ["baby", "infant", "kids", "child", "newborn"],
      };

      const detectCategory = (productName: string): string | undefined => {
        const searchText = productName.toLowerCase();
        
        for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
          for (const keyword of keywords) {
            if (searchText.includes(keyword.toLowerCase())) {
              const matchedCategory = existingCategories.find(c => c.slug === categorySlug);
              if (matchedCategory) {
                return matchedCategory.id;
              }
            }
          }
        }
        return existingCategories.find(c => c.slug === "medicines")?.id;
      };

      const findBrandId = (brandName: string): string | undefined => {
        if (!brandName) return undefined;
        const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return existingBrands.find(b => b.slug === slug || b.name.toLowerCase() === brandName.toLowerCase())?.id;
      };

      // Collect products from all pages
      const allProductData: Array<{name: string; price: number; image: string; brand: string}> = [];
      
      for (let page = startPage; page <= endPage; page++) {
        const url = `https://dwatson.pk/medicines.html?p=${page}`;
        
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
            },
            timeout: 60000
          });

          const $ = cheerio.load(response.data);

          // D.Watson product structure: li.product-item or .product-item-info
          $('.product-item, .item.product, li.item').each((_, el) => {
            const $item = $(el);
            
            // Extract product name from strong a or .product-item-link
            let name = $item.find('strong a, .product-item-link, a.product-item-link').first().text().trim();
            if (!name) {
              name = $item.find('a[href*=".html"]').first().text().trim();
            }
            if (!name || name.length < 2) return;
            
            // Extract price - look for Rs. pattern
            const itemText = $item.text();
            const priceMatch = itemText.match(/Rs\.\s*([\d,]+(?:\.\d{1,2})?)/i);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
            
            // Extract image
            let image = '';
            const $img = $item.find('img.product-image-photo, img[src*="media/catalog"]').first();
            if ($img.length) {
              image = $img.attr('src') || $img.attr('data-src') || '';
            }
            if (!image) {
              const $anyImg = $item.find('img').first();
              image = $anyImg.attr('src') || $anyImg.attr('data-src') || '';
            }
            
            // Extract brand if available
            const brand = $item.find('.brand-name, .product-brand').text().trim();
            
            if (name && price > 0) {
              allProductData.push({ name, price, image, brand });
            }
          });
          
          // Alternative method: Look for product links in ordered/unordered lists
          if (allProductData.length === 0) {
            $('ol.products li, ul.products li').each((_, el) => {
              const $item = $(el);
              
              const $link = $item.find('a[href*=".html"]').first();
              const name = $item.find('strong').first().text().trim() || $link.text().trim();
              if (!name || name.length < 2) return;
              
              const itemText = $item.text();
              const priceMatch = itemText.match(/Rs\.\s*([\d,]+(?:\.\d{1,2})?)/i);
              const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
              
              const image = $item.find('img').first().attr('src') || '';
              const brand = '';
              
              if (name && price > 0) {
                allProductData.push({ name, price, image, brand });
              }
            });
          }
        } catch (pageError) {
          console.error(`Failed to fetch D.Watson page ${page}:`, pageError);
        }
      }

      // Deduplicate by name
      const seen = new Set<string>();
      const uniqueProducts = allProductData.filter(p => {
        const key = p.name.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const productsToProcess = uniqueProducts.slice(0, maxProducts);

      for (const product of productsToProcess) {
        try {
          const { name, price, image, brand } = product;
          
          // Check for duplicates in database
          if (existingNames.has(name.toLowerCase().trim())) {
            importedProducts.push({
              name,
              price,
              image,
              brand,
              status: "skipped",
              error: "Product already exists"
            });
            skipped++;
            continue;
          }

          if (name && price > 0) {
            const categoryId = detectCategory(name);
            const brandId = findBrandId(brand);
            
            await storage.createProduct({
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
              description: `Imported from D.Watson Pharmacy`,
              price,
              images: image ? [image] : [],
              categoryId: categoryId || undefined,
              brandId: brandId || undefined,
              isActive: true,
              isFeatured: false,
              stock: 20,
            });

            existingNames.add(name.toLowerCase().trim());
            importedProducts.push({
              name,
              price,
              image: image || "https://via.placeholder.com/100",
              brand,
              status: "success",
            });
            imported++;
          } else if (name) {
            importedProducts.push({
              name,
              price,
              image: image || "",
              brand,
              status: "error",
              error: price <= 0 ? "Invalid price" : "Missing data"
            });
            failed++;
          }
        } catch (productError) {
          failed++;
        }
      }

      res.json({
        success: imported > 0 || skipped > 0,
        imported,
        failed,
        skipped,
        products: importedProducts,
        message: allProductData.length === 0 ? "D.Watson may have changed their page structure." : undefined
      });
    } catch (error) {
      console.error("D.Watson import error:", error);
      res.status(500).json({ 
        error: "Failed to import products from D.Watson", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Unified URL-based Product Import - Auto-detects source and uses appropriate scraper
  app.post("/api/admin/import-from-url", async (req: Request, res: Response) => {
    try {
      const { url, maxProducts = 50 } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Detect source from URL
      let source = "Unknown";
      let hostname = "";
      try {
        hostname = new URL(url).hostname.toLowerCase();
        if (hostname.includes("najeeb")) source = "Najeeb Pharmacy";
        else if (hostname.includes("dwatson")) source = "D.Watson";
        else if (hostname.includes("shaheen")) source = "Shaheen Chemist";
      } catch {
        return res.status(400).json({ error: "Invalid URL provided" });
      }

      const importedProducts: Array<{
        name: string;
        price: number;
        image: string;
        status: "success" | "error" | "skipped";
        error?: string;
      }> = [];
      
      let imported = 0;
      let failed = 0;
      let skipped = 0;

      // Get existing data
      const existingCategories = await storage.getCategories();
      const existingProducts = await storage.getProducts();
      const existingBrands = await storage.getBrands();
      const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));

      // Category detection helper
      const categoryKeywords: Record<string, string[]> = {
        "skin-care": ["skin", "face", "cleanser", "moisturizer", "serum", "cream", "lotion", "facial", "acne", "derma", "whitening"],
        "hair-care": ["hair", "shampoo", "conditioner", "scalp", "dandruff", "hairfall", "anagrow", "minoxidil"],
        "vitamins": ["vitamin", "supplement", "multivitamin", "omega", "calcium", "iron", "zinc", "tablets"],
        "medicines": ["medicine", "tablet", "capsule", "syrup", "paracetamol", "pain", "fever", "cold", "cough", "mg", "drop", "injection", "gel", "ointment", "sachet", "susp", "inj"],
        "baby": ["baby", "infant", "kids", "child", "newborn"],
        "sunscreen": ["sunscreen", "spf", "sunblock", "sun protection"],
      };

      const detectCategory = (productName: string): string | undefined => {
        const searchText = productName.toLowerCase();
        for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
          for (const keyword of keywords) {
            if (searchText.includes(keyword.toLowerCase())) {
              const matchedCategory = existingCategories.find(c => c.slug === categorySlug);
              if (matchedCategory) return matchedCategory.id;
            }
          }
        }
        return existingCategories.find(c => c.slug === "medicines")?.id;
      };

      // Price parsing helper - handles various formats
      const parsePrice = (text: string): number => {
        let clean = text
          .replace(/Rs\.?/gi, '')
          .replace(/PKR/gi, '')
          .replace(/₨/g, '')
          .replace(/₹/g, '')
          .replace(/\$/g, '')
          .replace(/\s/g, '')
          .trim();
        
        if (/,\d{3}/.test(clean)) {
          clean = clean.replace(/,/g, '');
        } else if (/,\d{2}$/.test(clean)) {
          clean = clean.replace(',', '.');
        }
        return parseFloat(clean) || 0;
      };

      // Collect products based on source
      const allProductData: Array<{name: string; price: number; image: string}> = [];

      const axiosConfig = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 60000
      };

      if (source === "Najeeb Pharmacy") {
        // Najeeb Pharmacy scraping - Updated selectors
        try {
          const response = await axios.get(url, axiosConfig);
          const $ = cheerio.load(response.data);

          // Look for product cards - Najeeb uses various structures
          $('a[href*="/products/"]').each((_, el) => {
            const $link = $(el);
            const href = $link.attr('href') || '';
            
            // Accept any /products/ link (not just numeric IDs)
            if (!href.includes('/products/')) return;
            
            let name = $link.find('h6, h5, .product-name, .title').text().trim();
            if (!name) name = $link.text().trim();
            if (!name || name.length < 3 || name.length > 200) return;
            
            let $card = $link.closest('.card, .product-card, .col, [class*="col-"], .product-item');
            if ($card.length === 0) $card = $link.parent().parent().parent().parent();
            
            const cardText = $card.text();
            // Look for various price patterns
            const priceMatch = cardText.match(/(?:Rs\.?|PKR|₨)\s*([\d,]+(?:\.\d{1,2})?)/i) ||
                               cardText.match(/([\d,]+(?:\.\d{1,2})?)\s*(?:Rs|PKR)/i);
            const price = priceMatch ? parsePrice(priceMatch[1]) : 0;
            
            let image = '';
            $card.find('img').each((_, imgEl) => {
              const src = $(imgEl).attr('src') || $(imgEl).attr('data-src') || '';
              if (src && !image) {
                image = src.startsWith('http') ? src : `https://api.najeebmart.com${src.startsWith('/') ? '' : '/'}${src}`;
              }
            });
            
            if (price > 0) {
              allProductData.push({ name, price, image });
            }
          });

          // Alternative: Find product items directly
          if (allProductData.length === 0) {
            $('.product-item, .product-card, .card').each((_, el) => {
              const $item = $(el);
              const name = $item.find('h6 a, h5 a, .product-name, .title').first().text().trim();
              if (!name || name.length < 3) return;
              
              const itemText = $item.text();
              const priceMatch = itemText.match(/(?:Rs\.?|PKR|₨)\s*([\d,]+(?:\.\d{1,2})?)/i);
              const price = priceMatch ? parsePrice(priceMatch[1]) : 0;
              
              const $img = $item.find('img').first();
              let image = $img.attr('src') || $img.attr('data-src') || '';
              if (image && !image.startsWith('http')) {
                image = `https://api.najeebmart.com${image.startsWith('/') ? '' : '/'}${image}`;
              }
              
              if (price > 0) {
                allProductData.push({ name, price, image });
              }
            });
          }
        } catch (err) {
          console.error("Najeeb scraping error:", err);
        }
      } else if (source === "D.Watson") {
        // D.Watson scraping - Updated selectors
        try {
          const response = await axios.get(url, axiosConfig);
          const $ = cheerio.load(response.data);

          // D.Watson uses Magento structure
          $('.product-item, .item.product, li.item, .product-item-info').each((_, el) => {
            const $item = $(el);
            
            let name = $item.find('.product-item-link, strong a, a.product-item-link').first().text().trim();
            if (!name) name = $item.find('a[href*=".html"]').first().text().trim();
            if (!name || name.length < 3) return;
            
            // D.Watson uses data-price-amount or various price selectors
            let price = 0;
            const dataPriceEl = $item.find('[data-price-amount]').first();
            if (dataPriceEl.length) {
              price = parseFloat(dataPriceEl.attr('data-price-amount') || '0');
            }
            if (!price) {
              const priceEl = $item.find('.price, .final-price .price, .special-price .price').first();
              const priceText = priceEl.text();
              price = parsePrice(priceText);
            }
            if (!price) {
              const itemText = $item.text();
              const priceMatch = itemText.match(/(?:Rs\.?|PKR|₨)\s*([\d,]+(?:\.\d{1,2})?)/i);
              if (priceMatch) price = parsePrice(priceMatch[1]);
            }
            
            let image = '';
            const $img = $item.find('img.product-image-photo, img[src*="media/catalog"], img').first();
            image = $img.attr('src') || $img.attr('data-src') || '';
            
            if (price > 0) {
              allProductData.push({ name, price, image });
            }
          });

          // Alternative structure
          if (allProductData.length === 0) {
            $('ol.products li, ul.products li').each((_, el) => {
              const $item = $(el);
              const name = $item.find('strong, .product-item-link').first().text().trim();
              if (!name || name.length < 3) return;
              
              let price = 0;
              const dataPriceEl = $item.find('[data-price-amount]').first();
              if (dataPriceEl.length) {
                price = parseFloat(dataPriceEl.attr('data-price-amount') || '0');
              } else {
                const priceText = $item.find('.price').first().text();
                price = parsePrice(priceText);
              }
              
              const image = $item.find('img').first().attr('src') || '';
              
              if (price > 0) {
                allProductData.push({ name, price, image });
              }
            });
          }
        } catch (err) {
          console.error("D.Watson scraping error:", err);
        }
      } else {
        // Generic/Shaheen scraping - WooCommerce style
        try {
          const response = await axios.get(url, axiosConfig);
          const $ = cheerio.load(response.data);

          const productSelectors = ['.product', '.products .product', '.product-item', '.product-card', 'li.product', '[data-product-id]'];
          let $products: ReturnType<typeof $> | null = null;
          
          for (const selector of productSelectors) {
            const found = $(selector);
            if (found.length > 0) { $products = found; break; }
          }

          if ($products && $products.length > 0) {
            $products.each((_, el) => {
              const $item = $(el);
              
              const nameSelectors = ['.woocommerce-loop-product__title', '.product-title', '.product-name', 'h2', 'h3', '.title'];
              let name = '';
              for (const sel of nameSelectors) {
                const found = $item.find(sel).first().text().trim();
                if (found) { name = found; break; }
              }
              if (!name) name = $item.find('a').first().text().trim();
              if (!name || name.length < 3) return;
              
              const priceSelectors = ['.price ins .amount', '.price .amount', '.woocommerce-Price-amount', '.product-price', '.price'];
              let priceText = '';
              for (const sel of priceSelectors) {
                const found = $item.find(sel).first().text().trim();
                if (found) { priceText = found; break; }
              }
              const price = parsePrice(priceText);
              
              const imgSelectors = ['img.wp-post-image', 'img.attachment-woocommerce_thumbnail', '.product-image img', 'img'];
              let image = '';
              for (const sel of imgSelectors) {
                const imgEl = $item.find(sel).first();
                image = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || '';
                if (image) break;
              }
              if (image && !image.startsWith('http')) {
                try {
                  const baseUrl = new URL(url);
                  image = new URL(image, baseUrl.origin).toString();
                } catch {}
              }
              
              if (price > 0) {
                allProductData.push({ name, price, image });
              }
            });
          }
        } catch (err) {
          console.error("Generic scraping error:", err);
        }
      }

      // Deduplicate
      const seen = new Set<string>();
      const uniqueProducts = allProductData.filter(p => {
        const key = p.name.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Process products
      const productsToProcess = uniqueProducts.slice(0, maxProducts);

      for (const product of productsToProcess) {
        try {
          const { name, price, image } = product;
          
          if (existingNames.has(name.toLowerCase().trim())) {
            importedProducts.push({ name, price, image, status: "skipped", error: "Product already exists" });
            skipped++;
            continue;
          }

          const categoryId = detectCategory(name);
          
          await storage.createProduct({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
            description: `Imported from ${source}`,
            price,
            images: image ? [image] : [],
            categoryId: categoryId || undefined,
            isActive: true,
            isFeatured: false,
            stock: 20,
          });

          existingNames.add(name.toLowerCase().trim());
          importedProducts.push({ name, price, image: image || "https://via.placeholder.com/100", status: "success" });
          imported++;
        } catch (productError) {
          failed++;
          importedProducts.push({ name: product.name, price: product.price, image: product.image, status: "error", error: "Failed to save" });
        }
      }

      res.json({
        success: imported > 0,
        imported,
        failed,
        skipped,
        source,
        products: importedProducts,
        message: allProductData.length === 0 ? `Could not find products on ${source}. The website structure may have changed.` : undefined
      });
    } catch (error) {
      console.error("Import from URL error:", error);
      res.status(500).json({ 
        error: "Failed to import products", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Sitemap.xml - Dynamic sitemap for Google indexing (aqeelpharmacy.com)
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = "https://aqeelpharmacy.com";
      const today = new Date().toISOString().split('T')[0];
      
      let products: any[] = [];
      let categories: any[] = [];
      let brands: any[] = [];
      
      try {
        products = await storage.getProducts();
        categories = await storage.getCategories();
        brands = await storage.getBrands();
      } catch (dbError) {
        console.error("Database error in sitemap:", dbError);
      }

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "daily" },
        { url: "/products", priority: "0.9", changefreq: "daily" },
        { url: "/brands", priority: "0.8", changefreq: "weekly" },
        { url: "/checkout", priority: "0.6", changefreq: "monthly" },
        { url: "/track-order", priority: "0.5", changefreq: "monthly" },
        { url: "/account/login", priority: "0.5", changefreq: "monthly" },
        { url: "/policies/privacy", priority: "0.4", changefreq: "yearly" },
        { url: "/policies/shipping", priority: "0.4", changefreq: "yearly" },
        { url: "/policies/returns", priority: "0.4", changefreq: "yearly" },
        { url: "/policies/terms", priority: "0.4", changefreq: "yearly" },
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

      // Static pages
      for (const page of staticPages) {
        xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      }

      // Category pages (high priority for SEO)
      for (const category of categories) {
        xml += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      // Brand pages
      for (const brand of brands) {
        xml += `
  <url>
    <loc>${baseUrl}/products?brand=${brand.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }

      // Product pages
      for (const product of products) {
        if (product.isActive) {
          xml += `
  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      }

      xml += `
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (error) {
      console.error("Sitemap error:", error);
      res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aqeelpharmacy.com/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`);
    }
  });

  // Robots.txt
  app.get("/robots.txt", (req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /checkout
Disallow: /api/

Sitemap: https://aqeelpharmacy.com/sitemap.xml`;

    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  return httpServer;
}
