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
      this.categories.set(id, { 
        id, 
        name: cat.name, 
        slug: cat.slug, 
        description: toNull(cat.description), 
        image: toNull(cat.image), 
        parentId: toNull(cat.parentId) 
      });
    });

    const brands: InsertBrand[] = [
      // A
      { name: "Abbott", slug: "abbott", description: "Global healthcare company" },
      { name: "AcneRid", slug: "acnerid", description: "Acne treatment solutions" },
      { name: "Aichun Beauty", slug: "aichun-beauty", description: "Beauty and skincare products" },
      { name: "Anexa", slug: "anexa", description: "Healthcare products" },
      { name: "Aptamil", slug: "aptamil", description: "Baby nutrition" },
      { name: "Argan Deluxe", slug: "argan-deluxe", description: "Argan oil hair care" },
      { name: "Armani", slug: "armani", description: "Luxury fragrances" },
      { name: "Aveeno", slug: "aveeno", description: "Natural skincare" },
      { name: "Axe", slug: "axe", description: "Men's grooming" },
      // B
      { name: "Babi Mild", slug: "babi-mild", description: "Baby care products" },
      { name: "Batiste", slug: "batiste", description: "Dry shampoo specialists" },
      { name: "Bed Head", slug: "bed-head", description: "Professional hair styling" },
      { name: "Bentley", slug: "bentley", description: "Luxury fragrances" },
      { name: "Brylcreem", slug: "brylcreem", description: "Men's hair styling" },
      { name: "Burberry", slug: "burberry", description: "British luxury brand" },
      { name: "Bvlgari", slug: "bvlgari", description: "Italian luxury brand" },
      // C
      { name: "Calvin Klein", slug: "calvin-klein", description: "Designer fragrances" },
      { name: "CeraVe", slug: "cerave", description: "Developed with dermatologists" },
      { name: "Cetaphil", slug: "cetaphil", description: "Gentle skincare for all skin types" },
      { name: "Chanel", slug: "chanel", description: "French luxury brand" },
      { name: "Clean & Clear", slug: "clean-clear", description: "Skincare for teens" },
      { name: "Clear", slug: "clear", description: "Anti-dandruff hair care" },
      { name: "Conatural", slug: "conatural", description: "Natural skincare" },
      { name: "Cow & Gate", slug: "cow-gate", description: "Baby nutrition" },
      // D
      { name: "Dalan D'Olive", slug: "dalan-dolive", description: "Olive oil skincare" },
      { name: "David Beckham", slug: "david-beckham", description: "Men's fragrances" },
      { name: "Dior", slug: "dior", description: "French luxury brand" },
      { name: "Dove", slug: "dove", description: "Real beauty" },
      // E
      { name: "Enfamil", slug: "enfamil", description: "Baby nutrition" },
      { name: "Eskulin", slug: "eskulin", description: "Kids personal care" },
      // F
      { name: "Fa", slug: "fa", description: "Personal care products" },
      { name: "Ferrari", slug: "ferrari", description: "Luxury fragrances" },
      { name: "Finesse", slug: "finesse", description: "Hair care" },
      { name: "FOGG", slug: "fogg", description: "Body sprays" },
      // G
      { name: "Garnier", slug: "garnier", description: "Natural beauty" },
      { name: "Gatsby", slug: "gatsby", description: "Men's styling products" },
      { name: "Got2b", slug: "got2b", description: "Hair styling" },
      { name: "Gucci", slug: "gucci", description: "Italian luxury brand" },
      // H
      { name: "Headshock", slug: "headshock", description: "Hair care" },
      { name: "Hermès", slug: "hermes", description: "French luxury brand" },
      { name: "Hugo Boss", slug: "hugo-boss", description: "Designer fragrances" },
      // J
      { name: "Jaguar", slug: "jaguar", description: "Men's fragrances" },
      { name: "Jenpharm", slug: "jenpharm", description: "Professional skincare solutions" },
      { name: "Jimmy Choo", slug: "jimmy-choo", description: "Luxury fragrances" },
      { name: "John Frieda", slug: "john-frieda", description: "Professional hair care" },
      { name: "Johnson's", slug: "johnsons", description: "Baby care trusted brand" },
      // K
      { name: "Kenneth Cole", slug: "kenneth-cole", description: "Designer fragrances" },
      // L
      { name: "L'Oreal", slug: "loreal", description: "Because you're worth it" },
      { name: "Lalique", slug: "lalique", description: "Luxury fragrances" },
      { name: "Lux", slug: "lux", description: "Beauty soap and body wash" },
      // M
      { name: "Maybelline", slug: "maybelline", description: "Makeup that's NYC-inspired" },
      { name: "Medix", slug: "medix", description: "Healthcare products" },
      { name: "Mercedes-Benz", slug: "mercedes-benz", description: "Luxury fragrances" },
      { name: "Mistine", slug: "mistine", description: "Thai beauty brand" },
      { name: "Mont Blanc", slug: "mont-blanc", description: "Luxury fragrances" },
      // N
      { name: "Neoliva", slug: "neoliva", description: "Skincare solutions" },
      { name: "Neutrogena", slug: "neutrogena", description: "Dermatologist recommended" },
      { name: "Nike", slug: "nike", description: "Sports fragrances" },
      { name: "Nivea", slug: "nivea", description: "Trusted skincare" },
      { name: "Nutrifactor", slug: "nutrifactor", description: "Pakistani supplements" },
      // O
      { name: "OGX", slug: "ogx", description: "Exotic hair care" },
      { name: "Olay", slug: "olay", description: "Anti-aging skincare" },
      // P
      { name: "Paco Rabanne", slug: "paco-rabanne", description: "Designer fragrances" },
      { name: "Palmer's", slug: "palmers", description: "Cocoa butter experts" },
      { name: "Pantene", slug: "pantene", description: "Strong is beautiful" },
      { name: "PharmaHealth", slug: "pharmahealth", description: "Healthcare solutions" },
      { name: "Pond's", slug: "ponds", description: "Skincare classics" },
      // R
      { name: "Rasasi", slug: "rasasi", description: "Arabian perfumes" },
      { name: "Remy Marquis", slug: "remy-marquis", description: "French fragrances" },
      // S
      { name: "Set Wet", slug: "set-wet", description: "Men's styling" },
      { name: "Simple", slug: "simple", description: "Kind to skin" },
      { name: "St. Ives", slug: "st-ives", description: "Natural scrubs" },
      { name: "Suave", slug: "suave", description: "Affordable beauty" },
      { name: "Sudocream", slug: "sudocream", description: "Healing cream" },
      { name: "Sunsilk", slug: "sunsilk", description: "Hair care solutions" },
      { name: "Syoss", slug: "syoss", description: "Professional hair care" },
      // T
      { name: "The Ordinary", slug: "the-ordinary", description: "Clinical formulations with integrity" },
      { name: "Thomas Kosmala", slug: "thomas-kosmala", description: "Niche fragrances" },
      { name: "Toni&Guy", slug: "toni-guy", description: "Professional hair styling" },
      { name: "TRESemmé", slug: "tresemme", description: "Salon-quality hair care" },
      // V
      { name: "Vaseline", slug: "vaseline", description: "Healing moisture" },
      { name: "Veet", slug: "veet", description: "Hair removal experts" },
      { name: "Versace", slug: "versace", description: "Italian luxury brand" },
      { name: "Vince", slug: "vince", description: "Pakistani skincare" },
      // W
      { name: "Wella", slug: "wella", description: "Professional hair color" },
      // Y
      { name: "Yves Saint Laurent", slug: "ysl", description: "French luxury brand" },
    ];

    brands.forEach((brand) => {
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
    
    // Helper to find brand by slug
    const findBrand = (slug: string) => brandArray.find(b => b.slug === slug);

    const sampleProducts: InsertProduct[] = [
      {
        name: "Cetaphil Gentle Skin Cleanser 500ml",
        slug: "cetaphil-gentle-skin-cleanser-500ml",
        description: "A mild, non-irritating cleanser that gently cleans without stripping skin of natural oils.",
        price: 3250,
        comparePrice: 3500,
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"],
        categoryId: categoryArray[0].id,
        brandId: findBrand("cetaphil")?.id,
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
        brandId: findBrand("cerave")?.id,
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
        brandId: findBrand("the-ordinary")?.id,
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
        brandId: findBrand("loreal")?.id,
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
        brandId: findBrand("dove")?.id,
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
        brandId: findBrand("jenpharm")?.id,
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
        brandId: findBrand("johnsons")?.id,
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
      this.products.set(id, { 
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
    for (const [id, otp] of this.otpVerifications.entries()) {
      if (new Date(otp.expiresAt) < now || otp.isUsed) {
        this.otpVerifications.delete(id);
      }
    }
  }
}

import { mongoStorage } from "./mongo-storage";
import { connectDB } from "./db";

// Environment check for production vs development
const isProduction = process.env.NODE_ENV === 'production';
const allowMemStorageFallback = process.env.USE_MEM_STORAGE === 'true' || !isProduction;

// Storage wrapper that falls back to MemStorage if MongoDB fails (dev only)
class StorageProxy implements IStorage {
  private fallbackStorage: MemStorage | null = null;
  private useMemStorage = false;
  private initPromise: Promise<void> | null = null;

  private async ensureInit(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = (async () => {
      try {
        await connectDB();
        this.useMemStorage = false;
        console.log('Using MongoDB storage');
      } catch (error) {
        if (!allowMemStorageFallback) {
          console.error('MongoDB connection failed in production mode. Set USE_MEM_STORAGE=true to allow fallback:', error);
          throw error;
        }
        console.warn('MongoDB connection failed, falling back to in-memory storage (development mode):', error);
        this.useMemStorage = true;
        this.fallbackStorage = new MemStorage();
      }
    })();
    
    return this.initPromise;
  }

  private get activeStorage(): IStorage {
    if (this.useMemStorage && this.fallbackStorage) {
      return this.fallbackStorage;
    }
    return mongoStorage;
  }

  // Proxy all IStorage methods
  async getUser(id: string) { await this.ensureInit(); return this.activeStorage.getUser(id); }
  async getUserByUsername(username: string) { await this.ensureInit(); return this.activeStorage.getUserByUsername(username); }
  async createUser(user: InsertUser) { await this.ensureInit(); return this.activeStorage.createUser(user); }
  async getProducts() { await this.ensureInit(); return this.activeStorage.getProducts(); }
  async getProduct(id: string) { await this.ensureInit(); return this.activeStorage.getProduct(id); }
  async getProductBySlug(slug: string) { await this.ensureInit(); return this.activeStorage.getProductBySlug(slug); }
  async getFeaturedProducts() { await this.ensureInit(); return this.activeStorage.getFeaturedProducts(); }
  async getProductsByCategory(slug: string) { await this.ensureInit(); return this.activeStorage.getProductsByCategory(slug); }
  async getProductsByBrand(slug: string) { await this.ensureInit(); return this.activeStorage.getProductsByBrand(slug); }
  async createProduct(product: InsertProduct) { await this.ensureInit(); return this.activeStorage.createProduct(product); }
  async updateProduct(id: string, product: Partial<InsertProduct>) { await this.ensureInit(); return this.activeStorage.updateProduct(id, product); }
  async deleteProduct(id: string) { await this.ensureInit(); return this.activeStorage.deleteProduct(id); }
  async getCategories() { await this.ensureInit(); return this.activeStorage.getCategories(); }
  async getCategory(id: string) { await this.ensureInit(); return this.activeStorage.getCategory(id); }
  async getCategoryBySlug(slug: string) { await this.ensureInit(); return this.activeStorage.getCategoryBySlug(slug); }
  async createCategory(category: InsertCategory) { await this.ensureInit(); return this.activeStorage.createCategory(category); }
  async updateCategory(id: string, category: Partial<InsertCategory>) { await this.ensureInit(); return this.activeStorage.updateCategory(id, category); }
  async deleteCategory(id: string) { await this.ensureInit(); return this.activeStorage.deleteCategory(id); }
  async getBrands() { await this.ensureInit(); return this.activeStorage.getBrands(); }
  async getBrand(id: string) { await this.ensureInit(); return this.activeStorage.getBrand(id); }
  async getBrandBySlug(slug: string) { await this.ensureInit(); return this.activeStorage.getBrandBySlug(slug); }
  async createBrand(brand: InsertBrand) { await this.ensureInit(); return this.activeStorage.createBrand(brand); }
  async updateBrand(id: string, brand: Partial<InsertBrand>) { await this.ensureInit(); return this.activeStorage.updateBrand(id, brand); }
  async deleteBrand(id: string) { await this.ensureInit(); return this.activeStorage.deleteBrand(id); }
  async getOrders() { await this.ensureInit(); return this.activeStorage.getOrders(); }
  async getOrder(id: string) { await this.ensureInit(); return this.activeStorage.getOrder(id); }
  async getOrderWithItems(id: string) { await this.ensureInit(); return this.activeStorage.getOrderWithItems(id); }
  async getOrderByTrackingNumber(trackingNumber: string) { await this.ensureInit(); return this.activeStorage.getOrderByTrackingNumber(trackingNumber); }
  async createOrder(order: InsertOrder) { await this.ensureInit(); return this.activeStorage.createOrder(order); }
  async createOrderWithItems(order: InsertOrder, items: InsertOrderItem[]) { await this.ensureInit(); return this.activeStorage.createOrderWithItems(order, items); }
  async updateOrderStatus(id: string, status: string) { await this.ensureInit(); return this.activeStorage.updateOrderStatus(id, status); }
  async getBanners() { await this.ensureInit(); return this.activeStorage.getBanners(); }
  async createBanner(banner: InsertBanner) { await this.ensureInit(); return this.activeStorage.createBanner(banner); }
  async updateBanner(id: string, banner: Partial<InsertBanner>) { await this.ensureInit(); return this.activeStorage.updateBanner(id, banner); }
  async deleteBanner(id: string) { await this.ensureInit(); return this.activeStorage.deleteBanner(id); }
  async getClients() { await this.ensureInit(); return this.activeStorage.getClients(); }
  async getClient(id: string) { await this.ensureInit(); return this.activeStorage.getClient(id); }
  async getClientByEmail(email: string) { await this.ensureInit(); return this.activeStorage.getClientByEmail(email); }
  async createClient(client: InsertClient) { await this.ensureInit(); return this.activeStorage.createClient(client); }
  async updateClient(id: string, client: Partial<InsertClient>) { await this.ensureInit(); return this.activeStorage.updateClient(id, client); }
  async deleteClient(id: string) { await this.ensureInit(); return this.activeStorage.deleteClient(id); }
  async getClientOrders(clientId: string) { await this.ensureInit(); return this.activeStorage.getClientOrders(clientId); }
  async createOtp(otpData: InsertOtp) { await this.ensureInit(); return this.activeStorage.createOtp(otpData); }
  async getValidOtp(email: string, otp: string) { await this.ensureInit(); return this.activeStorage.getValidOtp(email, otp); }
  async markOtpAsUsed(id: string) { await this.ensureInit(); return this.activeStorage.markOtpAsUsed(id); }
  async cleanupExpiredOtps() { await this.ensureInit(); return this.activeStorage.cleanupExpiredOtps(); }
}

// Use storage proxy with automatic fallback
export const storage: IStorage = new StorageProxy();
