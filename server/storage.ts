import { 
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Brand, type InsertBrand,
  type Order, type InsertOrder, type OrderWithItems,
  type OrderItem,
  type Banner, type InsertBanner,
  type Client, type InsertClient,
  type OtpVerification, type InsertOtp
} from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage, CreateOrderItem } from './storage-types';
import { seedCategories, allBrands, seedProducts } from './seed-data';

export type { IStorage, CreateOrderItem } from './storage-types';

function toNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private brands: Map<string, Brand>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private banners: Map<string, Banner>;
  private clients: Map<string, Client>;
  private otpVerifications: Map<string, OtpVerification>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.banners = new Map();
    this.clients = new Map();
    this.otpVerifications = new Map();

    this.initializeSampleData();
  }

  private initializeSampleData() {
    seedCategories.forEach((cat) => {
      const id = randomUUID();
      this.categories.set(id, { 
        id, 
        name: cat.name, 
        slug: cat.slug, 
        description: toNull(cat.description), 
        image: toNull(cat.image), 
        parentId: toNull(cat.parentId) 
      });
    });

    allBrands.forEach((brand) => {
      const id = randomUUID();
      this.brands.set(id, { 
        id, 
        name: brand.name, 
        slug: brand.slug, 
        description: toNull(brand.description), 
        logo: toNull(brand.logo) 
      });
    });

    const categoryArray = Array.from(this.categories.values());
    const brandArray = Array.from(this.brands.values());
    
    const findCategory = (slug: string) => categoryArray.find(c => c.slug === slug);
    const findBrand = (slug: string) => brandArray.find(b => b.slug === slug);

    seedProducts.forEach((product) => {
      const id = randomUUID();
      const category = findCategory(product.categorySlug);
      const brand = findBrand(product.brandSlug);
      
      this.products.set(id, { 
        id, 
        name: product.name, 
        slug: product.slug, 
        description: toNull(product.description), 
        price: product.price, 
        comparePrice: toNull(product.comparePrice), 
        images: product.images.length > 0 ? product.images : null, 
        categoryId: category?.id ?? null, 
        brandId: brand?.id ?? null, 
        stock: product.stock ?? 0, 
        isFeatured: product.isFeatured ?? false, 
        isActive: product.isActive ?? true, 
        sku: toNull(product.sku), 
        weight: null, 
        tags: product.tags.length > 0 ? product.tags : null 
      });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: toNull(insertUser.email),
      phone: toNull(insertUser.phone),
      isAdmin: false 
    };
    this.users.set(id, user);
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.isActive);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find((p) => p.slug === slug);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.isFeatured && p.isActive);
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    return Array.from(this.products.values()).filter((p) => p.categoryId === category.id && p.isActive);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = { 
      id,
      name: product.name,
      slug: product.slug,
      description: toNull(product.description),
      price: product.price,
      comparePrice: toNull(product.comparePrice),
      images: toNull(product.images),
      categoryId: toNull(product.categoryId),
      brandId: toNull(product.brandId),
      stock: product.stock ?? 0,
      isFeatured: product.isFeatured ?? false,
      isActive: product.isActive ?? true,
      sku: toNull(product.sku),
      weight: toNull(product.weight),
      tags: toNull(product.tags)
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find((c) => c.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = { 
      id,
      name: category.name,
      slug: category.slug,
      description: toNull(category.description),
      image: toNull(category.image),
      parentId: toNull(category.parentId)
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return Array.from(this.brands.values()).find((b) => b.slug === slug);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const newBrand: Brand = { 
      id,
      name: brand.name,
      slug: brand.slug,
      description: toNull(brand.description),
      logo: toNull(brand.logo)
    };
    this.brands.set(id, newBrand);
    return newBrand;
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existing = this.brands.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...brand };
    this.brands.set(id, updated);
    return updated;
  }

  async deleteBrand(id: string): Promise<boolean> {
    return this.brands.delete(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined> {
    const order = Array.from(this.orders.values()).find((o) => o.orderNumber === orderNumber);
    if (!order) return undefined;
    const items = Array.from(this.orderItems.values()).filter((i) => i.orderId === order.id);
    return { ...order, items };
  }

  async createOrder(orderData: InsertOrder, items: CreateOrderItem[]): Promise<OrderWithItems> {
    const id = randomUUID();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = { 
      id, 
      orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      city: orderData.city,
      postalCode: toNull(orderData.postalCode),
      notes: toNull(orderData.notes),
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost ?? 0,
      total: orderData.total,
      status: orderData.status ?? "pending",
      paymentMethod: toNull(orderData.paymentMethod),
      createdAt: new Date().toISOString()
    };
    this.orders.set(id, order);

    const orderItems: OrderItem[] = items.map((item) => {
      const itemId = randomUUID();
      const orderItem: OrderItem = { 
        id: itemId, 
        orderId: id,
        productId: item.productId,
        productName: item.productName,
        productImage: toNull(item.productImage),
        price: item.price,
        quantity: item.quantity
      };
      this.orderItems.set(itemId, orderItem);
      return orderItem;
    });

    return { ...order, items: orderItems };
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }

  // Banners
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values()).filter((b) => b.isActive);
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = randomUUID();
    const newBanner: Banner = { 
      id,
      title: toNull(banner.title),
      subtitle: toNull(banner.subtitle),
      image: banner.image,
      link: toNull(banner.link),
      isActive: banner.isActive ?? true,
      order: banner.order ?? 0
    };
    this.banners.set(id, newBanner);
    return newBanner;
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      id,
      email: clientData.email,
      name: toNull(clientData.name),
      phone: toNull(clientData.phone),
      address: toNull(clientData.address),
      city: toNull(clientData.city),
      postalCode: toNull(clientData.postalCode),
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...clientData };
    this.clients.set(id, updated);
    return updated;
  }

  async getOrdersByClientEmail(email: string): Promise<OrderWithItems[]> {
    const clientOrders = Array.from(this.orders.values())
      .filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return clientOrders.map((order) => {
      const items = Array.from(this.orderItems.values()).filter((i) => i.orderId === order.id);
      return { ...order, items };
    });
  }

  // OTP
  async createOtp(otpData: InsertOtp): Promise<OtpVerification> {
    const id = randomUUID();
    const otp: OtpVerification = {
      ...otpData,
      id,
      isUsed: false,
      createdAt: new Date().toISOString(),
    };
    this.otpVerifications.set(id, otp);
    return otp;
  }

  async getValidOtp(email: string, otp: string): Promise<OtpVerification | undefined> {
    const now = new Date();
    return Array.from(this.otpVerifications.values()).find(
      (o) =>
        o.email.toLowerCase() === email.toLowerCase() &&
        o.otp === otp &&
        !o.isUsed &&
        new Date(o.expiresAt) > now
    );
  }

  async markOtpAsUsed(id: string): Promise<void> {
    const otp = this.otpVerifications.get(id);
    if (otp) {
      this.otpVerifications.set(id, { ...otp, isUsed: true });
    }
  }

  async cleanupExpiredOtps(): Promise<void> {
    const now = new Date();
    const entries = Array.from(this.otpVerifications.entries());
    for (const [id, otp] of entries) {
      if (new Date(otp.expiresAt) < now || otp.isUsed) {
        this.otpVerifications.delete(id);
      }
    }
  }
}

// STORAGE SELECTION:
// Using MemStorage for Vercel serverless deployment for the following reasons:
// 1. Vercel has a 10-second function timeout on hobby tier - MongoDB cold starts can exceed this
// 2. MongoDB connection pooling is challenging in serverless environments
// 3. The StorageProxy pattern had TypeScript type mismatches with missing interface methods
// 4. MemStorage provides consistent type-safe implementation of all IStorage methods
// 
// For production with persistent data, consider:
// - Using Vercel KV, Vercel Postgres, or edge-compatible databases
// - Implementing proper connection pooling with serverless-compatible MongoDB driver
// - Adding missing IStorage methods to mongoStorage implementation
export const storage: IStorage = new MemStorage();
