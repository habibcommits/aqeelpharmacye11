import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import * as cheerio from "cheerio";
import { storage } from "./storage";
import { insertProductSchema, insertBrandSchema, insertCategorySchema, checkoutFormSchema } from "@shared/schema";

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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);

      // Look for brand links with images - common patterns for brand pages
      const brandElements: Array<{ name: string; logo: string }> = [];

      // Pattern 1: Links with brand images (like the example site)
      $('a[href*="/collections/"]').each((_, el) => {
        const $el = $(el);
        const img = $el.find('img');
        if (img.length > 0) {
          const name = img.attr('alt') || $el.text().trim();
          const logo = img.attr('src') || '';
          if (name && logo) {
            brandElements.push({ name, logo });
          }
        }
      });

      // Pattern 2: Standalone images with brand names
      if (brandElements.length === 0) {
        $('img[alt]').each((_, el) => {
          const $el = $(el);
          const name = $el.attr('alt') || '';
          const logo = $el.attr('src') || '';
          const parent = $el.closest('a');
          if (name && logo && parent.attr('href')?.includes('/collections/')) {
            brandElements.push({ name, logo });
          }
        });
      }

      // Pattern 3: Generic brand cards
      if (brandElements.length === 0) {
        $('.brand, .brand-item, .brand-card, [data-brand]').each((_, el) => {
          const $el = $(el);
          const name = $el.find('h2, h3, .brand-name, .title').text().trim() || $el.text().trim();
          const logo = $el.find('img').attr('src') || '';
          if (name) {
            brandElements.push({ name, logo });
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

      let products: cheerio.Cheerio<cheerio.Element> | null = null;
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
          const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

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

  return httpServer;
}
