import { connectDB } from './db';
import { 
  User, Category, Brand, Product, Order, Banner, Client, OtpVerification,
  IUser, ICategory, IBrand, IProduct, IOrder, IBanner, IClient, IOtpVerification
} from './models';
import { 
  type User as UserType, type InsertUser, 
  type Product as ProductType, type InsertProduct,
  type Category as CategoryType, type InsertCategory,
  type Brand as BrandType, type InsertBrand,
  type Order as OrderType, type InsertOrder, type OrderWithItems,
  type OrderItem as OrderItemType, type InsertOrderItem,
  type Banner as BannerType, type InsertBanner,
  type Client as ClientType, type InsertClient,
  type OtpVerification as OtpType, type InsertOtp
} from "@shared/schema";
import { IStorage } from './storage-types';

function toPlainObject<T>(doc: any): T {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;
  return obj as T;
}

export class MongoStorage implements IStorage {
  private async ensureConnection(): Promise<void> {
    await connectDB();
  }

  // Users
  async getUser(id: string): Promise<UserType | undefined> {
    await this.ensureConnection();
    const user = await User.findById(id);
    return user ? toPlainObject<UserType>(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    await this.ensureConnection();
    const user = await User.findOne({ username });
    return user ? toPlainObject<UserType>(user) : undefined;
  }

  async createUser(userData: InsertUser): Promise<UserType> {
    await this.ensureConnection();
    const user = await User.create(userData);
    return toPlainObject<UserType>(user);
  }

  // Products
  async getProducts(): Promise<ProductType[]> {
    await this.ensureConnection();
    const products = await Product.find({ isActive: true });
    return products.map(p => toPlainObject<ProductType>(p));
  }

  async getProduct(id: string): Promise<ProductType | undefined> {
    await this.ensureConnection();
    const product = await Product.findById(id);
    return product ? toPlainObject<ProductType>(product) : undefined;
  }

  async getProductBySlug(slug: string): Promise<ProductType | undefined> {
    await this.ensureConnection();
    const product = await Product.findOne({ slug });
    return product ? toPlainObject<ProductType>(product) : undefined;
  }

  async getFeaturedProducts(): Promise<ProductType[]> {
    await this.ensureConnection();
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
    return products.map(p => toPlainObject<ProductType>(p));
  }

  async getProductsByCategory(categorySlug: string): Promise<ProductType[]> {
    await this.ensureConnection();
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return [];
    const products = await Product.find({ categoryId: category._id.toString(), isActive: true });
    return products.map(p => toPlainObject<ProductType>(p));
  }

  async createProduct(productData: InsertProduct): Promise<ProductType> {
    await this.ensureConnection();
    const product = await Product.create(productData);
    return toPlainObject<ProductType>(product);
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<ProductType | undefined> {
    await this.ensureConnection();
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    return product ? toPlainObject<ProductType>(product) : undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  // Categories
  async getCategories(): Promise<CategoryType[]> {
    await this.ensureConnection();
    const categories = await Category.find();
    return categories.map(c => toPlainObject<CategoryType>(c));
  }

  async getCategory(id: string): Promise<CategoryType | undefined> {
    await this.ensureConnection();
    const category = await Category.findById(id);
    return category ? toPlainObject<CategoryType>(category) : undefined;
  }

  async getCategoryBySlug(slug: string): Promise<CategoryType | undefined> {
    await this.ensureConnection();
    const category = await Category.findOne({ slug });
    return category ? toPlainObject<CategoryType>(category) : undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<CategoryType> {
    await this.ensureConnection();
    const category = await Category.create(categoryData);
    return toPlainObject<CategoryType>(category);
  }

  async updateCategory(id: string, categoryData: Partial<InsertCategory>): Promise<CategoryType | undefined> {
    await this.ensureConnection();
    const category = await Category.findByIdAndUpdate(id, categoryData, { new: true });
    return category ? toPlainObject<CategoryType>(category) : undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  // Brands
  async getBrands(): Promise<BrandType[]> {
    await this.ensureConnection();
    const brands = await Brand.find();
    return brands.map(b => toPlainObject<BrandType>(b));
  }

  async getBrand(id: string): Promise<BrandType | undefined> {
    await this.ensureConnection();
    const brand = await Brand.findById(id);
    return brand ? toPlainObject<BrandType>(brand) : undefined;
  }

  async getBrandBySlug(slug: string): Promise<BrandType | undefined> {
    await this.ensureConnection();
    const brand = await Brand.findOne({ slug });
    return brand ? toPlainObject<BrandType>(brand) : undefined;
  }

  async createBrand(brandData: InsertBrand): Promise<BrandType> {
    await this.ensureConnection();
    const brand = await Brand.create(brandData);
    return toPlainObject<BrandType>(brand);
  }

  async updateBrand(id: string, brandData: Partial<InsertBrand>): Promise<BrandType | undefined> {
    await this.ensureConnection();
    const brand = await Brand.findByIdAndUpdate(id, brandData, { new: true });
    return brand ? toPlainObject<BrandType>(brand) : undefined;
  }

  async deleteBrand(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await Brand.findByIdAndDelete(id);
    return !!result;
  }

  // Orders
  async getOrders(): Promise<OrderType[]> {
    await this.ensureConnection();
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders.map(o => toPlainObject<OrderType>(o));
  }

  async getOrder(id: string): Promise<OrderType | undefined> {
    await this.ensureConnection();
    const order = await Order.findById(id);
    return order ? toPlainObject<OrderType>(order) : undefined;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems | undefined> {
    await this.ensureConnection();
    const order = await Order.findOne({ orderNumber });
    return order ? toPlainObject<OrderWithItems>(order) : undefined;
  }

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    await this.ensureConnection();
    const orderNumber = `AQ-${Date.now().toString(36).toUpperCase()}`;
    const order = await Order.create({
      ...orderData,
      orderNumber,
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
      })),
    });
    return toPlainObject<OrderWithItems>(order);
  }

  async updateOrderStatus(id: string, status: string): Promise<OrderType | undefined> {
    await this.ensureConnection();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return order ? toPlainObject<OrderType>(order) : undefined;
  }

  // Banners
  async getBanners(): Promise<BannerType[]> {
    await this.ensureConnection();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    return banners.map(b => toPlainObject<BannerType>(b));
  }

  async createBanner(bannerData: InsertBanner): Promise<BannerType> {
    await this.ensureConnection();
    const banner = await Banner.create(bannerData);
    return toPlainObject<BannerType>(banner);
  }

  async updateBanner(id: string, bannerData: Partial<InsertBanner>): Promise<BannerType | undefined> {
    await this.ensureConnection();
    const banner = await Banner.findByIdAndUpdate(id, bannerData, { new: true });
    return banner ? toPlainObject<BannerType>(banner) : undefined;
  }

  async deleteBanner(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await Banner.findByIdAndDelete(id);
    return !!result;
  }

  async searchProducts(query: string): Promise<ProductType[]> {
    await this.ensureConnection();
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    return products.map(p => toPlainObject<ProductType>(p));
  }

  // Clients
  async getClient(id: string): Promise<ClientType | undefined> {
    await this.ensureConnection();
    const client = await Client.findById(id);
    return client ? toPlainObject<ClientType>(client) : undefined;
  }

  async getClientByEmail(email: string): Promise<ClientType | undefined> {
    await this.ensureConnection();
    const client = await Client.findOne({ email });
    return client ? toPlainObject<ClientType>(client) : undefined;
  }

  async createClient(clientData: InsertClient): Promise<ClientType> {
    await this.ensureConnection();
    const client = await Client.create({
      ...clientData,
      createdAt: new Date().toISOString(),
    });
    return toPlainObject<ClientType>(client);
  }

  async updateClient(id: string, clientData: Partial<InsertClient>): Promise<ClientType | undefined> {
    await this.ensureConnection();
    const client = await Client.findByIdAndUpdate(id, clientData, { new: true });
    return client ? toPlainObject<ClientType>(client) : undefined;
  }

  // OTP Verification
  async createOtp(otpData: InsertOtp): Promise<OtpType> {
    await this.ensureConnection();
    const otp = await OtpVerification.create({
      ...otpData,
      createdAt: new Date().toISOString(),
    });
    return toPlainObject<OtpType>(otp);
  }

  async getOtpByEmail(email: string): Promise<OtpType | undefined> {
    await this.ensureConnection();
    const otp = await OtpVerification.findOne({ 
      email, 
      isUsed: false,
      expiresAt: { $gt: new Date().toISOString() }
    }).sort({ createdAt: -1 });
    return otp ? toPlainObject<OtpType>(otp) : undefined;
  }

  async markOtpAsUsed(id: string): Promise<void> {
    await this.ensureConnection();
    await OtpVerification.findByIdAndUpdate(id, { isUsed: true });
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.ensureConnection();
    await OtpVerification.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date().toISOString() } },
        { isUsed: true }
      ]
    });
  }

  // Missing methods required by IStorage interface
  async getOrdersByClientEmail(email: string): Promise<OrderWithItems[]> {
    await this.ensureConnection();
    const orders = await Order.find({ 
      customerEmail: { $regex: new RegExp(`^${email}$`, 'i') }
    }).sort({ createdAt: -1 });
    return orders.map(o => toPlainObject<OrderWithItems>(o));
  }

  async getValidOtp(email: string, otp: string): Promise<OtpType | undefined> {
    await this.ensureConnection();
    const otpDoc = await OtpVerification.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date().toISOString() }
    });
    return otpDoc ? toPlainObject<OtpType>(otpDoc) : undefined;
  }
}

export const mongoStorage = new MongoStorage();
