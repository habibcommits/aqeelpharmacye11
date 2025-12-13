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

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

let storage: MongoStorage | null = null;
let isConnected = false;

async function connectToMongo() {
  if (isConnected && storage) {
    return storage;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  try {
    await mongoose.connect(mongoUri);
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
