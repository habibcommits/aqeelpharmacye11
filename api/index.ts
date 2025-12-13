import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoStorage } from "../server/mongo-storage";
import {
  insertProductSchema,
  insertCategorySchema,
  insertBrandSchema,
  insertBannerSchema,
  checkoutFormSchema,
  clientLoginSchema,
  otpVerifySchema,
  clientProfileSchema,
} from "../shared/schema";
import { seedCategories, seedBrands, seedProducts } from "../server/seed-data";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

let storage: MongoStorage | null = null;
let isConnected = false;

async function connectToMongo() {
  if (isConnected && storage && mongoose.connection.readyState === 1) {
    return storage;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }
    isConnected = true;
    storage = new MongoStorage();
    console.log("Connected to MongoDB");
    return storage;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpExpiryTime(): string {
  return new Date(Date.now() + 10 * 60 * 1000).toISOString();
}

async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
  const nodemailer = await import("nodemailer");
  
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Aqeel Pharmacy" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your Verification Code - Aqeel Pharmacy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Aqeel Pharmacy</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #16a34a; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

const categoryKeywords: Record<string, string[]> = {
  "skin-care": ["skin", "face", "cleanser", "moisturizer", "serum", "cream", "lotion", "facial", "acne", "derma", "whitening"],
  "hair-care": ["hair", "shampoo", "conditioner", "scalp", "dandruff", "hairfall", "anagrow", "minoxidil"],
  "vitamins": ["vitamin", "supplement", "multivitamin", "omega", "calcium", "iron", "zinc", "tablets"],
  "medicines": ["medicine", "tablet", "capsule", "syrup", "paracetamol", "pain", "fever", "cold", "cough", "mg", "drop", "injection", "gel", "ointment", "sachet", "susp", "inj"],
  "baby": ["baby", "infant", "kids", "child", "newborn"],
  "sunscreen": ["sunscreen", "spf", "sunblock", "sun protection"],
  "makeup": ["makeup", "lipstick", "foundation", "mascara", "eyeshadow", "concealer", "blush", "primer"],
  "fragrance": ["perfume", "fragrance", "cologne", "body spray", "mist", "attar", "scent"],
};

function parsePrice(text: string): number {
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
}

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const products = await db.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/featured", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const products = await db.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

app.get("/api/products/category/:slug", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const products = await db.getProductsByCategory(req.params.slug);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:identifier", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const { identifier } = req.params;
    let product = await db.getProduct(identifier);
    if (!product) {
      product = await db.getProductBySlug(identifier);
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
    const db = await connectToMongo();
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const product = await db.createProduct(result.data);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.patch("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const product = await db.updateProduct(req.params.id, req.body);
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
    const db = await connectToMongo();
    const deleted = await db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const categories = await db.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/categories/:slug", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const category = await db.getCategoryBySlug(req.params.slug);
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
    const db = await connectToMongo();
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const category = await db.createCategory(result.data);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.patch("/api/categories/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const category = await db.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/categories/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const deleted = await db.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

app.get("/api/brands", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const brands = await db.getBrands();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

app.get("/api/brands/:slug", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const brand = await db.getBrandBySlug(req.params.slug);
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
    const db = await connectToMongo();
    const result = insertBrandSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const brand = await db.createBrand(result.data);
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Failed to create brand" });
  }
});

app.patch("/api/brands/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const brand = await db.updateBrand(req.params.id, req.body);
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
    const db = await connectToMongo();
    const deleted = await db.deleteBrand(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

app.get("/api/orders", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const orders = await db.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:orderNumber", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const order = await db.getOrderByNumber(req.params.orderNumber);
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
    const db = await connectToMongo();
    const { items, ...orderData } = req.body;

    const result = checkoutFormSchema.safeParse(orderData);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }

    const order = await db.createOrder(
      {
        ...result.data,
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        total: orderData.total,
        status: "pending",
        paymentMethod: "cod",
      },
      items.map((item: any) => ({
        orderId: "",
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
    const db = await connectToMongo();
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const order = await db.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.get("/api/banners", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const banners = await db.getBanners();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
});

app.post("/api/banners", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const result = insertBannerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const banner = await db.createBanner(result.data);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to create banner" });
  }
});

app.patch("/api/banners/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const banner = await db.updateBanner(req.params.id, req.body);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: "Failed to update banner" });
  }
});

app.delete("/api/banners/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const deleted = await db.deleteBanner(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete banner" });
  }
});

app.post("/api/auth/send-otp", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const result = clientLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const { email } = result.data;

    await db.cleanupExpiredOtps();

    const existingClient = await db.getClientByEmail(email);
    const isExistingUser = !!existingClient;

    const otp = generateOtp();
    const expiresAt = getOtpExpiryTime();

    await db.createOtp({ email, otp, expiresAt });

    const sent = await sendOtpEmail(email, otp);

    if (!sent) {
      return res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }

    res.json({
      success: true,
      message: "Verification code sent to your email",
      isExistingUser,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const result = otpVerifySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const { email, otp } = result.data;

    const validOtp = await db.getValidOtp(email, otp);

    if (!validOtp) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    await db.markOtpAsUsed(validOtp.id);

    let client = await db.getClientByEmail(email);
    const isNewUser = !client;

    if (!client) {
      client = await db.createClient({ email });
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
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
});

app.get("/api/client/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const client = await db.getClient(req.params.id);
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
    const db = await connectToMongo();
    const result = clientProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const client = await db.updateClient(req.params.id, result.data);
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
    res.status(500).json({ error: "Failed to update client" });
  }
});

app.get("/api/client/:id/orders", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const client = await db.getClient(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const orders = await db.getOrdersByClientEmail(client.email);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/imagekit/auth", async (req: Request, res: Response) => {
  try {
    const ImageKit = (await import("imagekit")).default;
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    res.status(500).json({ error: "Failed to generate ImageKit auth parameters" });
  }
});

app.post("/api/imagekit/upload", async (req: Request, res: Response) => {
  try {
    const { file, fileName, folder = "products" } = req.body;
    
    if (!file || !fileName) {
      return res.status(400).json({ error: "File and fileName are required" });
    }

    const ImageKit = (await import("imagekit")).default;
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });

    const response = await imagekit.upload({
      file,
      fileName,
      folder: `aqeel-pharmacy/${folder}`,
    });

    res.json({
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    const products = await db.searchProducts(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to search products" });
  }
});

app.post("/api/admin/import-brands", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const axios = (await import("axios")).default;
    const cheerio = await import("cheerio");
    
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

    if (deleteExisting) {
      const existingBrands = await db.getBrands();
      for (const brand of existingBrands) {
        await db.deleteBrand(brand.id);
      }
    }

    const existingBrands = await db.getBrands();
    const existingSlugs = new Set(existingBrands.map(b => b.slug.toLowerCase()));

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);

    const brandElements: Array<{ name: string; logo: string }> = [];

    const hostname = new URL(url).hostname.toLowerCase();
    const isNajeeb = hostname.includes("najeeb");
    const isDWatson = hostname.includes("dwatson");

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

    for (const [, brand] of Array.from(uniqueBrands)) {
      const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      
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
        await db.createBrand({
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

app.post("/api/admin/import-from-url", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const axios = (await import("axios")).default;
    const cheerio = await import("cheerio");
    
    const { url, maxProducts = 50 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const safeMaxProducts = Math.min(Math.max(1, maxProducts || 50), 100);

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

    const existingCategories = await db.getCategories();
    const existingProducts = await db.getProducts();
    const existingBrands = await db.getBrands();
    const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));

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

    const allProductData: Array<{name: string; price: number; image: string}> = [];

    const axiosConfig = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 30000
    };

    try {
      const response = await axios.get(url, axiosConfig);
      const $ = cheerio.load(response.data);

      if (source === "Shaheen Chemist") {
        $('.product-item, .product-card, .card, [class*="product"]').each((_, el) => {
          const $item = $(el);
          
          let name = $item.find('.product-title, .product-name, h2 a, h3 a, h4 a, .title a').first().text().trim();
          if (!name) {
            name = $item.find('a[href*="/product"]').first().text().trim();
          }
          if (!name || name.length < 3) return;
          
          const itemText = $item.text();
          const priceMatch = itemText.match(/(?:Rs\.?|PKR|₨)\s*([\d,]+(?:\.\d{1,2})?)/i);
          const price = priceMatch ? parsePrice(priceMatch[1]) : 0;
          
          let image = '';
          const $img = $item.find('img').first();
          image = $img.attr('src') || $img.attr('data-src') || '';
          
          if (name && price > 0) {
            allProductData.push({ name, price, image });
          }
        });
      } else if (source === "Najeeb Pharmacy") {
        $('a[href*="/products/"]').each((_, el) => {
          const $link = $(el);
          const href = $link.attr('href') || '';
          
          if (!href.includes('/products/')) return;
          
          let name = $link.find('h6, h5, .product-name, .title').text().trim();
          if (!name) name = $link.text().trim();
          if (!name || name.length < 3 || name.length > 200) return;
          
          let $card = $link.closest('.card, .product-card, .col, [class*="col-"], .product-item');
          if ($card.length === 0) $card = $link.parent().parent().parent().parent();
          
          const cardText = $card.text();
          const priceMatch = cardText.match(/(?:Rs\.?|PKR|₨)\s*([\d,]+(?:\.\d{1,2})?)/i);
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
      } else if (source === "D.Watson") {
        $('.product-item, .item.product, li.item').each((_, el) => {
          const $item = $(el);
          
          let name = $item.find('strong a, .product-item-link, a.product-item-link').first().text().trim();
          if (!name) {
            name = $item.find('a[href*=".html"]').first().text().trim();
          }
          if (!name || name.length < 2) return;
          
          const itemText = $item.text();
          const priceMatch = itemText.match(/Rs\.\s*([\d,]+(?:\.\d{1,2})?)/i);
          const price = priceMatch ? parsePrice(priceMatch[1]) : 0;
          
          let image = '';
          const $img = $item.find('img.product-image-photo, img[src*="media/catalog"]').first();
          if ($img.length) {
            image = $img.attr('src') || $img.attr('data-src') || '';
          }
          if (!image) {
            const $anyImg = $item.find('img').first();
            image = $anyImg.attr('src') || $anyImg.attr('data-src') || '';
          }
          
          if (name && price > 0) {
            allProductData.push({ name, price, image });
          }
        });
      } else {
        $('[class*="product"]').each((_, el) => {
          const $item = $(el);
          
          let name = $item.find('h2, h3, h4, .title, .name, a').first().text().trim();
          if (!name || name.length < 3) return;
          
          const itemText = $item.text();
          const priceMatch = itemText.match(/(?:Rs\.?|PKR|₨|\$)\s*([\d,]+(?:\.\d{1,2})?)/i);
          const price = priceMatch ? parsePrice(priceMatch[1]) : 0;
          
          let image = $item.find('img').first().attr('src') || '';
          
          if (name && price > 0) {
            allProductData.push({ name, price, image });
          }
        });
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return res.status(500).json({ 
        error: "Failed to fetch the website",
        message: fetchError instanceof Error ? fetchError.message : "Network error"
      });
    }

    const seen = new Set<string>();
    const uniqueProducts = allProductData.filter(p => {
      const key = p.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const productsToProcess = uniqueProducts.slice(0, safeMaxProducts);

    for (const product of productsToProcess) {
      try {
        const { name, price, image } = product;
        
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
          
          await db.createProduct({
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
          importedProducts.push({
            name,
            price,
            image: image || "",
            status: "success",
          });
          imported++;
        } else {
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
        importedProducts.push({
          name: product.name,
          price: product.price,
          image: product.image || "",
          status: "error",
          error: productError instanceof Error ? productError.message : "Failed to save"
        });
      }
    }

    res.json({
      success: imported > 0 || skipped > 0,
      source,
      imported,
      failed,
      skipped,
      products: importedProducts,
      message: allProductData.length === 0 ? `Could not find products on ${source}. The website structure may have changed.` : undefined
    });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ 
      error: "Failed to import products", 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.post("/api/admin/import-products", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const axios = (await import("axios")).default;
    const cheerio = await import("cheerio");
    
    const { url, maxProducts = 20 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    const existingCategories = await db.getCategories();
    const existingProducts = await db.getProducts();
    const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));
    
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

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);

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
    
    const productCount = Math.min(products.length, maxProducts);

    for (let i = 0; i < productCount; i++) {
      try {
        const productEl = $(products[i]);
        
        const productUrl = productEl.find('a').first().attr('href') || '';
        
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

        const priceSelectors = ['.price ins .amount', '.price .amount', '.woocommerce-Price-amount', '.product-price', '.price'];
        let priceText = '';
        for (const sel of priceSelectors) {
          const found = productEl.find(sel).first().text().trim();
          if (found) {
            priceText = found;
            break;
          }
        }
        const price = parsePrice(priceText);

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
          if (existingNames.has(name.toLowerCase().trim())) {
            importedProducts.push({
              name,
              price,
              image: image || "",
              status: "skipped",
              error: "Product already exists",
            });
            skipped++;
            continue;
          }
          
          const categoryId = detectCategory(name, productUrl);
          
          await db.createProduct({
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

          existingNames.add(name.toLowerCase().trim());
          importedProducts.push({
            name,
            price,
            image: image || "",
            status: "success",
          });
          imported++;
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
    });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ 
      error: "Failed to import products", 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const baseUrl = "https://aqeelpharmacy.com";
    
    const products = await db.getProducts();
    const categories = await db.getCategories();
    const brands = await db.getBrands();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/products</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/categories</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/brands</loc><priority>0.8</priority></url>`;

    for (const product of products) {
      sitemap += `\n  <url><loc>${baseUrl}/product/${product.slug}</loc><priority>0.6</priority></url>`;
    }

    for (const category of categories) {
      sitemap += `\n  <url><loc>${baseUrl}/category/${category.slug}</loc><priority>0.7</priority></url>`;
    }

    for (const brand of brands) {
      sitemap += `\n  <url><loc>${baseUrl}/brand/${brand.slug}</loc><priority>0.7</priority></url>`;
    }

    sitemap += "\n</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
});

app.get("/robots.txt", (req: Request, res: Response) => {
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://aqeelpharmacy.com/sitemap.xml`;
  res.setHeader("Content-Type", "text/plain");
  res.send(robotsTxt);
});

app.post("/api/admin/seed-database", async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const results = {
      categories: { created: 0, skipped: 0 },
      brands: { created: 0, skipped: 0 },
      products: { created: 0, skipped: 0 }
    };

    const categoryMap: Record<string, string> = {};
    for (const cat of seedCategories) {
      const existing = await db.getCategoryBySlug(cat.slug);
      if (existing) {
        categoryMap[cat.slug] = existing.id;
        results.categories.skipped++;
      } else {
        const created = await db.createCategory(cat);
        categoryMap[cat.slug] = created.id;
        results.categories.created++;
      }
    }

    const brandMap: Record<string, string> = {};
    for (const brand of seedBrands) {
      const existing = await db.getBrandBySlug(brand.slug);
      if (existing) {
        brandMap[brand.slug] = existing.id;
        results.brands.skipped++;
      } else {
        const created = await db.createBrand(brand);
        brandMap[brand.slug] = created.id;
        results.brands.created++;
      }
    }

    for (const product of seedProducts) {
      const existing = await db.getProductBySlug(product.slug);
      if (existing) {
        results.products.skipped++;
        continue;
      }

      const categoryId = categoryMap[product.categorySlug] || null;
      const brandId = brandMap[product.brandSlug] || null;

      await db.createProduct({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        categoryId: categoryId,
        brandId: brandId,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        sku: product.sku,
        tags: product.tags
      });
      results.products.created++;
    }

    res.json({ 
      success: true, 
      message: "Database seeded successfully",
      results 
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    const expressReq = req as unknown as Request;
    const expressRes = res as unknown as Response;

    expressRes.on("finish", () => resolve());
    expressRes.on("error", reject);

    app(expressReq, expressRes, (err: any) => {
      if (err) {
        console.error("Express error:", err);
        if (!expressRes.headersSent) {
          expressRes.status(500).json({ error: "Internal Server Error" });
        }
        resolve();
      }
    });
  });
}
