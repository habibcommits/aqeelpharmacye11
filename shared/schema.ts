import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: varchar("parent_id"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Brands table
export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  description: text("description"),
});

export const insertBrandSchema = createInsertSchema(brands).omit({ id: true });
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  comparePrice: real("compare_price"),
  images: text("images").array(),
  categoryId: varchar("category_id"),
  brandId: varchar("brand_id"),
  stock: integer("stock").default(0),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  sku: text("sku"),
  weight: text("weight"),
  tags: text("tags").array(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Cart items
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  notes: text("notes"),
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").default(0),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").default("cod"),
  createdAt: text("created_at").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, orderNumber: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Hero banners
export const banners = pgTable("banners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  link: text("link"),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
});

export const insertBannerSchema = createInsertSchema(banners).omit({ id: true });
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof banners.$inferSelect;

// Product with relations for frontend display
export interface ProductWithRelations extends Product {
  category?: Category;
  brand?: Brand;
}

// Cart item with product for display
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

// Order with items for display
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Checkout form schema
export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  shippingAddress: z.string().min(10, "Please enter a complete address"),
  city: z.string().min(2, "Please enter your city"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Order status options
export const orderStatuses = [
  "pending",
  "processing", 
  "shipped",
  "completed",
  "cancelled"
] as const;

export type OrderStatus = typeof orderStatuses[number];

// Client accounts table
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  isVerified: boolean("is_verified").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, isVerified: true });
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// OTP verification table
export const otpVerifications = pgTable("otp_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  otp: text("otp").notNull(),
  expiresAt: text("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertOtpSchema = createInsertSchema(otpVerifications).omit({ id: true, createdAt: true, isUsed: true });
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;

// Client login schema
export const clientLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ClientLoginData = z.infer<typeof clientLoginSchema>;

// OTP verification schema
export const otpVerifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type OtpVerifyData = z.infer<typeof otpVerifySchema>;

// Client profile update schema
export const clientProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  address: z.string().min(5, "Please enter a complete address").optional(),
  city: z.string().min(2, "Please enter your city").optional(),
  postalCode: z.string().optional(),
});

export type ClientProfileData = z.infer<typeof clientProfileSchema>;
