import { 
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Brand, type InsertBrand,
  type Order, type InsertOrder, type OrderWithItems,
  type OrderItem, type InsertOrderItem,
  type Banner, type InsertBanner
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Banners
  getBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private brands: Map<string, Brand>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private banners: Map<string, Banner>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.banners = new Map();

    this.initializeSampleData();
  }

  private initializeSampleData() {
    const categories: InsertCategory[] = [
      { name: "Skin Care", slug: "skin-care", description: "Cleansers, moisturizers, and treatments" },
      { name: "Hair Care", slug: "hair-care", description: "Shampoos, serums, and treatments" },
      { name: "Makeup", slug: "makeup", description: "Lipsticks, foundations, and palettes" },
      { name: "Fragrance", slug: "fragrance", description: "Perfumes and body mists" },
      { name: "Sunscreen", slug: "sunscreen", description: "SPF protection for all skin types" },
      { name: "Baby Care", slug: "baby", description: "Gentle products for babies" },
      { name: "Vitamins", slug: "vitamins", description: "Supplements and wellness products" },
      { name: "Medicines", slug: "medicines", description: "OTC medicines and healthcare" },
    ];

    categories.forEach((cat) => {
      const id = randomUUID();
      this.categories.set(id, { ...cat, id });
    });

    const brands: InsertBrand[] = [
      { name: "Cetaphil", slug: "cetaphil", description: "Gentle skincare for all skin types" },
      { name: "CeraVe", slug: "cerave", description: "Developed with dermatologists" },
      { name: "The Ordinary", slug: "the-ordinary", description: "Clinical formulations with integrity" },
      { name: "L'Oreal", slug: "loreal", description: "Because you're worth it" },
      { name: "Jenpharm", slug: "jenpharm", description: "Professional skincare solutions" },
      { name: "Dove", slug: "dove", description: "Real beauty" },
    ];

    brands.forEach((brand) => {
      const id = randomUUID();
      this.brands.set(id, { ...brand, id });
    });

    const categoryArray = Array.from(this.categories.values());
    const brandArray = Array.from(this.brands.values());

    const sampleProducts: InsertProduct[] = [
      {
        name: "Cetaphil Gentle Skin Cleanser 500ml",
        slug: "cetaphil-gentle-skin-cleanser-500ml",
        description: "A mild, non-irritating cleanser that gently cleans without stripping skin of natural oils.",
        price: 3250,
        comparePrice: 3500,
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"],
        categoryId: categoryArray[0].id,
        brandId: brandArray[0].id,
        stock: 50,
        isFeatured: true,
        isActive: true,
        sku: "CET-GC-500",
        weight: "500ml",
      },
      {
        name: "CeraVe Moisturizing Cream 453g",
        slug: "cerave-moisturizing-cream-453g",
        description: "Rich, non-greasy, fast-absorbing cream that provides 24-hour hydration.",
        price: 4500,
        comparePrice: 4800,
        images: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop"],
        categoryId: categoryArray[0].id,
        brandId: brandArray[1].id,
        stock: 35,
        isFeatured: true,
        isActive: true,
        sku: "CER-MC-453",
        weight: "453g",
      },
      {
        name: "The Ordinary Niacinamide 10% + Zinc 1%",
        slug: "the-ordinary-niacinamide-zinc",
        description: "A serum targeting visible blemishes and skin congestion.",
        price: 2100,
        comparePrice: 2500,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop"],
        categoryId: categoryArray[0].id,
        brandId: brandArray[2].id,
        stock: 80,
        isFeatured: true,
        isActive: true,
        sku: "ORD-NZ-30",
        weight: "30ml",
      },
      {
        name: "L'Oreal Paris Revitalift Night Cream",
        slug: "loreal-revitalift-night-cream",
        description: "Anti-wrinkle + firming night cream with Pro-Retinol A.",
        price: 3800,
        images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop"],
        categoryId: categoryArray[0].id,
        brandId: brandArray[3].id,
        stock: 25,
        isFeatured: true,
        isActive: true,
        sku: "LOR-RN-50",
        weight: "50ml",
      },
      {
        name: "Dove Intense Repair Shampoo 650ml",
        slug: "dove-intense-repair-shampoo",
        description: "Nourishes hair from root to tip for beautiful, strong hair.",
        price: 1250,
        comparePrice: 1400,
        images: ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=600&fit=crop"],
        categoryId: categoryArray[1].id,
        brandId: brandArray[5].id,
        stock: 100,
        isFeatured: false,
        isActive: true,
        sku: "DOV-IRS-650",
        weight: "650ml",
      },
      {
        name: "Jenpharm Spectra Block SPF 60",
        slug: "jenpharm-spectra-block-spf60",
        description: "Broad spectrum UVA/UVB protection with antioxidants.",
        price: 1850,
        images: ["https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=600&h=600&fit=crop"],
        categoryId: categoryArray[4].id,
        brandId: brandArray[4].id,
        stock: 45,
        isFeatured: true,
        isActive: true,
        sku: "JEN-SB-60",
        weight: "60g",
      },
      {
        name: "Johnson's Baby Lotion 500ml",
        slug: "johnsons-baby-lotion-500ml",
        description: "Clinically proven mild for newborn skin with 24hr moisture.",
        price: 950,
        images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop"],
        categoryId: categoryArray[5].id,
        stock: 70,
        isFeatured: false,
        isActive: true,
        sku: "JNS-BL-500",
        weight: "500ml",
      },
      {
        name: "Centrum Adults Multivitamin 100 Tablets",
        slug: "centrum-adults-multivitamin-100",
        description: "Complete multivitamin with essential vitamins and minerals.",
        price: 2850,
        comparePrice: 3000,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop"],
        categoryId: categoryArray[6].id,
        stock: 40,
        isFeatured: true,
        isActive: true,
        sku: "CEN-AM-100",
        weight: "100 tablets",
      },
    ];

    sampleProducts.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
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
    const user: User = { ...insertUser, id, isAdmin: false };
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
    const newProduct: Product = { ...product, id };
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
    const newCategory: Category = { ...category, id };
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
    const newBrand: Brand = { ...brand, id };
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

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    const id = randomUUID();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = { 
      ...orderData, 
      id, 
      orderNumber,
      createdAt: new Date().toISOString()
    };
    this.orders.set(id, order);

    const orderItems: OrderItem[] = items.map((item) => {
      const itemId = randomUUID();
      const orderItem: OrderItem = { ...item, id: itemId, orderId: id };
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
    const newBanner: Banner = { ...banner, id };
    this.banners.set(id, newBanner);
    return newBanner;
  }
}

export const storage = new MemStorage();
